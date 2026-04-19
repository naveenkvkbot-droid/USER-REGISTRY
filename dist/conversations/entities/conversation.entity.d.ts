import { User } from '../../users/entities/user.entity';
export declare class Conversation {
    id: string;
    userId: string;
    user: User;
    transcript: string;
    topics: string[];
    actionItems: string[];
    durationSeconds: number;
    locationHint: string | null;
    occurredAt: Date;
}
