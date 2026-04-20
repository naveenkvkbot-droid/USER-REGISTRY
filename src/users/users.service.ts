import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

interface ConversationSummary {
  id: string;
  topics: unknown[];
  actionItems: unknown[];
  occurredAt: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByIdOrThrow(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(data: Partial<User> = {}): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findByIdOrThrow(id);

    if (dto.name !== undefined) {
      user.name = dto.name;
    }
    if (dto.notes !== undefined) {
      user.notes = dto.notes;
    }

    return this.userRepository.save(user);
  }

  async updateLastSeenAt(id: string, lastSeenAt: Date): Promise<void> {
    await this.userRepository.update(id, { lastSeenAt });
  }

  async getUserSummary(id: string): Promise<{
    user: User;
    conversations: ConversationSummary[];
    faceCount: number;
  }> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['conversations', 'faceEmbeddings'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const sortedConversations = (user.conversations || [])
      .sort(
        (a, b) =>
          new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
      )
      .map(
        (c): ConversationSummary => ({
          id: c.id,
          topics: c.topics,
          actionItems: c.actionItems,
          occurredAt: c.occurredAt,
        }),
      );

    return {
      user,
      conversations: sortedConversations,
      faceCount: user.faceEmbeddings?.length || 0,
    };
  }
}
