export declare class FaceRegisterDto {
    embedding: number[];
    confidenceScore: number;
    source?: string;
    snapshotUrl?: string | null;
    locationHint?: string | null;
    existingUserId?: string | null;
}
