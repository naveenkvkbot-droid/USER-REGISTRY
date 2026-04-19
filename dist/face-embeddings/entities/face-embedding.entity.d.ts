import { User } from '../../users/entities/user.entity';
export declare class FaceEmbedding {
    id: string;
    userId: string;
    user: User;
    embedding: string;
    confidenceScore: number;
    source: string;
    snapshotUrl: string | null;
    capturedAt: Date;
}
