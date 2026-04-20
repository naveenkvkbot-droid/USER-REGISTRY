import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FaceEmbedding } from '../../face-embeddings/entities/face-embedding.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  name: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'first_seen_at' })
  firstSeenAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'last_seen_at' })
  lastSeenAt: Date;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    name: 'location_hint',
  })
  locationHint: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => FaceEmbedding, (embedding) => embedding.user, {
    cascade: true,
  })
  faceEmbeddings: FaceEmbedding[];

  @OneToMany(() => Conversation, (conversation) => conversation.user, {
    cascade: true,
  })
  conversations: Conversation[];
}
