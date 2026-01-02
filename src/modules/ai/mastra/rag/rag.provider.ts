import { Injectable, OnModuleInit } from '@nestjs/common';
import { MDocument } from '@mastra/rag';
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { PgVector } from '@mastra/pg';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Injectable()
export class RagProvider implements OnModuleInit {
  private pgVector: PgVector;
  private client: Client;

  constructor(private readonly configService: ConfigService) {
    const connectionString =
      this.configService.get('DATABASE_URL') ||
      `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    this.pgVector = new PgVector({
      connectionString,
    });

    this.client = new Client({ connectionString });
  }

  async onModuleInit() {
    // Initialize pgvector extension and create table/index
    await this.initializeVectorStore();

    // Add initial document after initialization
    // setTimeout(() => {
    //   const initialDocument =
    //     "Retrieval-Augmented Generation (RAG) is an architecture that enhances large language models by combining them with an external knowledge store. Instead of relying solely on parameters learned during training, a RAG system retrieves relevant documents or text chunks from a vector database at query time and injects that context into the model's prompt. This approach improves factual accuracy, enables up-to-date knowledge, and reduces hallucinations. Vector databases such as pgvector store embeddings that represent semantic meaning, allowing similarity search using cosine distance or inner product. By embedding both user queries and stored content into the same vector space, RAG systems can efficiently identify relevant information and generate responses grounded in retrieved data.";
    //   this.addDocument(initialDocument);
    // }, 1000);
  }

  private async initializeVectorStore() {
    let connected = false;
    try {
      await this.client.connect();
      connected = true;

      // Enable pgvector extension
      try {
        await this.client.query('CREATE EXTENSION IF NOT EXISTS vector');
        console.log('pgvector extension enabled');
      } catch (error: any) {
        if (error.code === '0A000') {
          console.error(
            'pgvector extension is not available. Please use a PostgreSQL image with pgvector installed (e.g., pgvector/pgvector:pg16)',
          );
          throw new Error(
            'pgvector extension not available. Update your PostgreSQL image to include pgvector.',
          );
        }
        throw error;
      }

      // Create the index if it doesn't exist
      // text-embedding-3-small has dimension 1536
      try {
        const indexes = await this.pgVector.listIndexes();
        if (!indexes.includes('embeddings')) {
          await this.pgVector.createIndex({
            indexName: 'embeddings',
            dimension: 1536, // Dimension for text-embedding-3-small
            metric: 'cosine', // Use cosine similarity
          });
          console.log('Vector index "embeddings" created');
        } else {
          console.log('Vector index "embeddings" already exists');
        }
      } catch (error: any) {
        // If index creation fails, log but don't throw (might already exist)
        console.warn('Index creation check:', error.message);
      }

      console.log('Vector store initialized successfully');
    } catch (error) {
      console.error('Error initializing vector store:', error);
      throw error;
    } finally {
      if (connected) {
        await this.client.end();
      }
    }
  }

  async addDocument(document: string) {
    // 1. Initialize document
    const doc = MDocument.fromText(document);

    // 2. Create chunks
    const chunks = await doc.chunk({
      strategy: 'recursive',
      size: 512,
      overlap: 50,
    });

    // 3. Generate embeddings; we need to pass the text of each chunk
    const { embeddings } = await embedMany({
      values: chunks.map((chunk) => chunk.text),
      model: openai.embedding('text-embedding-3-small'),
    });

    // 4. Store in vector database
    // PgVector.upsert expects vectors as number[][] and metadata as separate array
    const vectors = embeddings.map((embedding) => embedding);
    const metadataArray = chunks.map((chunk, index) => ({
      content: chunk.text,
      chunkIndex: index,
    }));
    const ids = chunks.map((_, index) => `chunk-${Date.now()}-${index}`);

    await this.pgVector.upsert({
      indexName: 'embeddings',
      vectors,
      metadata: metadataArray,
      ids,
    });

    // // 5. Query similar chunks
    // const results = await pgVector.query({
    //   indexName: 'embeddings',
    //   queryVector: queryVector,
    //   topK: 3,
    // }); // queryVector is the embedding of the query

    // console.log('Similar chunks:', results);
  }
}
