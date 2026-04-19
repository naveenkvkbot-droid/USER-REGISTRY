"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema001 = void 0;
class InitialSchema001 {
    name = 'InitialSchema001';
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);
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
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS conversations`);
        await queryRunner.query(`DROP TABLE IF EXISTS face_embeddings`);
        await queryRunner.query(`DROP TABLE IF EXISTS users`);
        await queryRunner.query(`DROP EXTENSION IF EXISTS vector`);
    }
}
exports.InitialSchema001 = InitialSchema001;
//# sourceMappingURL=001_initial_schema.js.map