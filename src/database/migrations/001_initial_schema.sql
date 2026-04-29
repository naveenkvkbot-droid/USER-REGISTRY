-- Initial schema migration for User Registry
-- Enables pgvector and creates the correct column types

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: Tables are created by TypeORM, but we need to alter the embedding column
-- Run this after TypeORM synchronization:
-- ALTER TABLE face_embeddings ALTER COLUMN embedding TYPE vector(128) USING embedding::vector(128);

-- Create ivfflat index for vector similarity search
-- CREATE INDEX IF NOT EXISTS face_embeddings_embedding_idx ON face_embeddings
--   USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
-- Note: Only create index after inserting sufficient data (recommended: > 1000 rows)
