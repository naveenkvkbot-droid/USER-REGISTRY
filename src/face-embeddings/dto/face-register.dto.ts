import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  IsString,
  IsOptional,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class FaceRegisterDto {
  @IsArray()
  @ArrayMinSize(128)
  @ArrayMaxSize(128)
  @IsNumber({}, { each: true })
  embedding: number[];

  @IsNumber()
  @Min(0)
  @Max(1)
  confidenceScore: number;

  @IsString()
  @IsOptional()
  source?: string = 'mediapipe';

  @IsString()
  @IsOptional()
  snapshotUrl?: string | null;

  @IsString()
  @IsOptional()
  locationHint?: string | null;

  @IsUUID()
  @IsOptional()
  existingUserId?: string | null;
}
