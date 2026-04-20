import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema001 implements MigrationInterface {
  name = 'InitialSchema001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pgvector extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(200),
        notes text,
        first_seen_at timestamptz NOT NULL DEFAULT now(),
        last_seen_at timestamptz NOT NULL DEFAULT now(),
        location_hint varchar(200),
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    // Create face_embeddings table
    await queryRunner.query(`
      CREATE TABLE face_embeddings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        embedding vector(128) NOT NULL,
        confidence_score real NOT NULL,
        source varchar(32) DEFAULT 'mediapipe',
        snapshot_url varchar(500),
        captured_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    // Create conversations table
    await queryRunner.query(`
      CREATE TABLE conversations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        transcript text NOT NULL,
        topics jsonb NOT NULL DEFAULT '[]',
        action_items jsonb NOT NULL DEFAULT '[]',
        duration_seconds int NOT NULL,
        location_hint varchar(200),
        occurred_at timestamptz NOT NULL
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE INDEX ON face_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100)
    `);
    await queryRunner.query(`
      CREATE INDEX ON face_embeddings (user_id)
    `);
    await queryRunner.query(`
      CREATE INDEX ON conversations (user_id, occurred_at DESC)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS conversations`);
    await queryRunner.query(`DROP TABLE IF EXISTS face_embeddings`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS vector`);
  }
}
