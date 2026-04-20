import { Controller, Post, Body } from '@nestjs/common';
import { FaceEmbeddingsService } from './face-embeddings.service';
import { FaceSearchDto } from './dto/face-search.dto';
import { FaceRegisterDto } from './dto/face-register.dto';

@Controller('faces')
export class FaceEmbeddingsController {
  constructor(private readonly faceEmbeddingsService: FaceEmbeddingsService) {}

  @Post('search')
  async search(@Body() dto: FaceSearchDto) {
    const threshold = dto.threshold ?? 0.4;
    const result = await this.faceEmbeddingsService.findClosestMatch(
      dto.embedding,
      threshold,
    );

    if (!result.matched || !result.user) {
      return {
        data: {
          matched: false,
          user: null,
          confidence: null,
          recentConversations: [],
        },
        error: null,
      };
    }

    const recentConversations =
      await this.faceEmbeddingsService.getRecentConversations(
        result.user.id,
        3,
      );

    return {
      data: {
        matched: true,
        user: {
          id: result.user.id,
          name: result.user.name,
          notes: result.user.notes,
          lastSeenAt: result.user.lastSeenAt.toISOString(),
        },
        confidence: result.confidence,
        recentConversations: recentConversations.map((c) => ({
          topics: c.topics,
          actionItems: c.actionItems,
          occurredAt:
            c.occurredAt instanceof Date
              ? c.occurredAt.toISOString()
              : c.occurredAt,
        })),
      },
      error: null,
    };
  }

  @Post('register')
  async register(@Body() dto: FaceRegisterDto) {
    const result = await this.faceEmbeddingsService.registerFace(
      dto.embedding,
      dto.confidenceScore,
      dto.source ?? 'mediapipe',
      dto.snapshotUrl ?? null,
      dto.locationHint ?? null,
      dto.existingUserId ?? null,
    );

    return {
      data: {
        userId: result.userId,
        faceEmbeddingId: result.faceEmbeddingId,
        isNewUser: result.isNewUser,
      },
      error: null,
    };
  }
}
