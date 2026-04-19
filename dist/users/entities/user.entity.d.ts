import { FaceEmbedding } from '../../face-embeddings/entities/face-embedding.entity';
import { Conversation } from '../../conversations/entities/conversation.entity';
export declare class User {
    id: string;
    name: string | null;
    notes: string | null;
    firstSeenAt: Date;
    lastSeenAt: Date;
    locationHint: string | null;
    createdAt: Date;
    faceEmbeddings: FaceEmbedding[];
    conversations: Conversation[];
}
