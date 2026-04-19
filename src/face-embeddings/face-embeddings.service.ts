import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FaceEmbedding } from './entities/face-embedding.entity';
import { User } from '../users/entities/user.entity';
import { Conversation } from '../conversations/entities/conversation.entity';

interface MatchResult {
  matched: boolean;
  user: User | null;
  confidence: number | null;
  distance: number | null;
}

@Injectable()
export class FaceEmbeddingsService {
  constructor(
    @InjectRepository(FaceEmbedding)
    private readonly faceEmbeddingRepository: Repository<FaceEmbedding>,
    private readonly dataSource: DataSource,
  ) {}

  async findClosestMatch(embedding: number[], threshold: number): Promise<MatchResult> {
    // Format the embedding as a vector string for pgvector
    const vectorString = `[${embedding.join(',')}]`;

    // Raw SQL query using pgvector's cosine distance operator <=>
    // Lower distance = better match (0 = identical, 2 = opposite)
    const query = `
      SELECT 
        u.id, 
        u.name, 
        u.notes, 
        u.first_seen_at as "firstSeenAt",
        u.last_seen_at as "lastSeenAt", 
        u.location_hint as "locationHint",
        u.created_at as "createdAt",
        (fe.embedding <=> $1::vector) AS distance
      FROM face_embeddings fe
      JOIN users u ON u.id = fe.user_id
      ORDER BY fe.embedding <=> $1::vector
      LIMIT 1
    `;

    const results: any[] = await this.dataSource.query(query, [vectorString]);

    if (results.length === 0) {
      return { matched: false, user: null, confidence: null, distance: null };
    }

    const result = results[0];
    const distance = parseFloat(result.distance);

    // Cosine distance: 0 = identical, 2 = opposite
    // Convert to confidence: 1 = perfect match, 0 = opposite
    const confidence = 1 - (distance / 2);

    if (distance > threshold) {
      return { matched: false, user: null, confidence: null, distance };
    }

    const user = new User();
    user.id = result.id;
    user.name = result.name;
    user.notes = result.notes;
    user.firstSeenAt = new Date(result.firstSeenAt);
    user.lastSeenAt = new Date(result.lastSeenAt);
    user.locationHint = result.locationHint;
    user.createdAt = new Date(result.createdAt);

    return { matched: true, user, confidence, distance };
  }

  async getRecentConversations(userId: string, limit: number = 3): Promise<Partial<Conversation>[]> {
    const query = `
      SELECT 
        id,
        topics,
        action_items as "actionItems",
        occurred_at as "occurredAt"
      FROM conversations
      WHERE user_id = $1
      ORDER BY occurred_at DESC
      LIMIT $2
    `;

    const results: any[] = await this.dataSource.query(query, [userId, limit]);
    
    return results.map((r: any) => ({
      id: r.id,
      topics: r.topics || [],
      actionItems: r.actionItems || [],
      occurredAt: r.occurredAt,
    }));
  }

  async registerFace(
    embedding: number[],
    confidenceScore: number,
    source: string,
    snapshotUrl: string | null,
    locationHint: string | null,
    existingUserId: string | null,
  ): Promise<{ userId: string; faceEmbeddingId: string; isNewUser: boolean }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let userId: string;
      let isNewUser: boolean;

      if (existingUserId) {
        // Verify the user exists
        const userExists = await queryRunner.query(
          'SELECT id FROM users WHERE id = $1',
          [existingUserId],
        );
        if (userExists.length === 0) {
          throw new NotFoundException('Existing user not found');
        }
        userId = existingUserId;
        isNewUser = false;
      } else {
        // Create new user
        const userResult = await queryRunner.query(
          `INSERT INTO users (name, notes, first_seen_at, last_seen_at, location_hint, created_at)
           VALUES (NULL, NULL, NOW(), NOW(), $1, NOW())
           RETURNING id`,
          [locationHint],
        );
        userId = userResult[0].id;
        isNewUser = true;
      }

      // Insert face embedding
      const vectorString = `[${embedding.join(',')}]`;
      const faceResult = await queryRunner.query(
        `INSERT INTO face_embeddings (user_id, embedding, confidence_score, source, snapshot_url, captured_at)
         VALUES ($1, $2::vector, $3, $4, $5, NOW())
         RETURNING id`,
        [userId, vectorString, confidenceScore, source, snapshotUrl],
      );
      const faceEmbeddingId = faceResult[0].id;

      await queryRunner.commitTransaction();

      return { userId, faceEmbeddingId, isNewUser };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}