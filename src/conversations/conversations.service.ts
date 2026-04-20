import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    dto: CreateConversationDto,
  ): Promise<{ conversationId: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify user exists
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const userExists = await queryRunner.query(
        'SELECT id FROM users WHERE id = $1',
        [dto.userId],
      );

      if ((userExists as unknown[]).length === 0) {
        throw new NotFoundException('User not found');
      }

      // Insert conversation
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const result = await queryRunner.query(
        `INSERT INTO conversations (user_id, transcript, topics, action_items, duration_seconds, location_hint, occurred_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          dto.userId,
          dto.transcript,
          JSON.stringify(dto.topics),
          JSON.stringify(dto.actionItems),
          dto.durationSeconds,
          dto.locationHint,
          dto.occurredAt,
        ],
      );

      const conversationId = (
        (result as unknown[])[0] as Record<string, unknown>
      ).id as string;

      // Update user's last_seen_at
      await queryRunner.query(
        `UPDATE users SET last_seen_at = $1 WHERE id = $2`,
        [dto.occurredAt, dto.userId],
      );

      await queryRunner.commitTransaction();

      return { conversationId };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByUserId(
    userId: string,
    limit: number = 10,
  ): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { userId },
      order: { occurredAt: 'DESC' },
      take: limit,
    });
  }
}
