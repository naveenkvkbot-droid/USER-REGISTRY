import {
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class FaceSearchDto {
  @IsArray()
  @ArrayMinSize(512)
  @ArrayMaxSize(512)
  @IsNumber({}, { each: true })
  embedding: number[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(2)
  threshold?: number = 0.4;
}
