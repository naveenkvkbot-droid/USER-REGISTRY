import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.conversations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  transcript: string;

  @Column({ type: 'jsonb', default: '[]' })
  topics: string[];

  @Column({ type: 'jsonb', default: '[]', name: 'action_items' })
  actionItems: string[];

  @Column({ type: 'int', name: 'duration_seconds' })
  durationSeconds: number;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'location_hint',
  })
  locationHint: string | null;

  @Column({ type: 'timestamptz', name: 'occurred_at' })
  occurredAt: Date;
}
