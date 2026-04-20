import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('face_embeddings')
export class FaceEmbedding {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.faceEmbeddings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // Stored as a string representation of the vector for TypeORM
  // Actual vector operations use raw SQL with pgvector
  @Column({ type: 'varchar', length: 5000, name: 'embedding' })
  embedding: string;

  @Column({ type: 'real', name: 'confidence_score' })
  confidenceScore: number;

  @Column({ type: 'varchar', length: 32, default: 'mediapipe', name: 'source' })
  source: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'snapshot_url',
  })
  snapshotUrl: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'captured_at' })
  capturedAt: Date;
}
