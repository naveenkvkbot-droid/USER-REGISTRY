import {
  IsString,
  IsUUID,
  IsArray,
  IsNumber,
  IsOptional,
  IsISO8601,
} from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  userId: string;

  @IsString()
  transcript: string;

  @IsArray()
  @IsString({ each: true })
  topics: string[];

  @IsArray()
  @IsString({ each: true })
  actionItems: string[];

  @IsNumber()
  durationSeconds: number;

  @IsString()
  @IsOptional()
  locationHint?: string | null;

  @IsISO8601()
  occurredAt: string;
}
