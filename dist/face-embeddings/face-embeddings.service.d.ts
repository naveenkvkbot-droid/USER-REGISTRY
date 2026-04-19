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
export declare class FaceEmbeddingsService {
    private readonly faceEmbeddingRepository;
    private readonly dataSource;
    constructor(faceEmbeddingRepository: Repository<FaceEmbedding>, dataSource: DataSource);
    findClosestMatch(embedding: number[], threshold: number): Promise<MatchResult>;
    getRecentConversations(userId: string, limit?: number): Promise<Partial<Conversation>[]>;
    registerFace(embedding: number[], confidenceScore: number, source: string, snapshotUrl: string | null, locationHint: string | null, existingUserId: string | null): Promise<{
        userId: string;
        faceEmbeddingId: string;
        isNewUser: boolean;
    }>;
}
export {};
