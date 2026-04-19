export declare class CreateConversationDto {
    userId: string;
    transcript: string;
    topics: string[];
    actionItems: string[];
    durationSeconds: number;
    locationHint?: string | null;
    occurredAt: string;
}
