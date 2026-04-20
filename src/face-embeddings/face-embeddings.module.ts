import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaceEmbeddingsService } from './face-embeddings.service';
import { FaceEmbeddingsController } from './face-embeddings.controller';
import { FaceEmbedding } from './entities/face-embedding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FaceEmbedding])],
  controllers: [FaceEmbeddingsController],
  providers: [FaceEmbeddingsService],
  exports: [FaceEmbeddingsService],
})
export class FaceEmbeddingsModule {}
