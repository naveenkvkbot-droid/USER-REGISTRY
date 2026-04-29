#!/bin/bash
# Database initialization script for User Registry
# Run this after docker-compose up to ensure pgvector is properly configured

set -e

echo "Initializing User Registry database..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL..."
until docker exec user-registry-postgres-1 pg_isready -U postgres > /dev/null 2>&1; do
  sleep 1
done

echo "PostgreSQL is ready"

# Enable extensions
echo "Enabling pgvector extension..."
docker exec user-registry-postgres-1 psql -U postgres -d user_registry -c "CREATE EXTENSION IF NOT EXISTS vector;"
docker exec user-registry-postgres-1 psql -U postgres -d user_registry -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"

# Check if face_embeddings table exists
TABLE_EXISTS=$(docker exec user-registry-postgres-1 psql -U postgres -d user_registry -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'face_embeddings');")

if [[ "$TABLE_EXISTS" =~ "t" ]]; then
  echo "Converting embedding column to vector(128)..."
  docker exec user-registry-postgres-1 psql -U postgres -d user_registry -c "ALTER TABLE face_embeddings ALTER COLUMN embedding TYPE vector(128) USING embedding::vector(128);" 2>/dev/null || echo "Column already converted or table doesn't exist yet"

  echo "Creating vector index..."
  docker exec user-registry-postgres-1 psql -U postgres -d user_registry -c "CREATE INDEX IF NOT EXISTS face_embeddings_embedding_idx ON face_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);" 2>/dev/null || echo "Index already exists"
fi

echo "Database initialization complete!"
echo ""
echo "Installed extensions:"
docker exec user-registry-postgres-1 psql -U postgres -d user_registry -c "\dx"
