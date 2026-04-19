import { FaceEmbeddingsService } from './face-embeddings.service';
import { FaceSearchDto } from './dto/face-search.dto';
import { FaceRegisterDto } from './dto/face-register.dto';
export declare class FaceEmbeddingsController {
    private readonly faceEmbeddingsService;
    constructor(faceEmbeddingsService: FaceEmbeddingsService);
    search(dto: FaceSearchDto): Promise<{
        data: {
            matched: boolean;
            user: null;
            confidence: null;
            recentConversations: never[];
        };
        error: null;
    } | {
        data: {
            matched: boolean;
            user: {
                id: string;
                name: string | null;
                notes: string | null;
                lastSeenAt: string;
            };
            confidence: number | null;
            recentConversations: {
                topics: string[] | undefined;
                actionItems: string[] | undefined;
                occurredAt: string | undefined;
            }[];
        };
        error: null;
    }>;
    register(dto: FaceRegisterDto): Promise<{
        data: {
            userId: string;
            faceEmbeddingId: string;
            isNewUser: boolean;
        };
        error: null;
    }>;
}
