"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceEmbeddingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const face_embedding_entity_1 = require("./entities/face-embedding.entity");
const user_entity_1 = require("../users/entities/user.entity");
let FaceEmbeddingsService = class FaceEmbeddingsService {
    faceEmbeddingRepository;
    dataSource;
    constructor(faceEmbeddingRepository, dataSource) {
        this.faceEmbeddingRepository = faceEmbeddingRepository;
        this.dataSource = dataSource;
    }
    async findClosestMatch(embedding, threshold) {
        const vectorString = `[${embedding.join(',')}]`;
        const query = `
      SELECT 
        u.id, 
        u.name, 
        u.notes, 
        u.first_seen_at as "firstSeenAt",
        u.last_seen_at as "lastSeenAt", 
        u.location_hint as "locationHint",
        u.created_at as "createdAt",
        (fe.embedding <=> $1::vector) AS distance
      FROM face_embeddings fe
      JOIN users u ON u.id = fe.user_id
      ORDER BY fe.embedding <=> $1::vector
      LIMIT 1
    `;
        const results = await this.dataSource.query(query, [vectorString]);
        if (results.length === 0) {
            return { matched: false, user: null, confidence: null, distance: null };
        }
        const result = results[0];
        const distance = parseFloat(result.distance);
        const confidence = 1 - (distance / 2);
        if (distance > threshold) {
            return { matched: false, user: null, confidence: null, distance };
        }
        const user = new user_entity_1.User();
        user.id = result.id;
        user.name = result.name;
        user.notes = result.notes;
        user.firstSeenAt = new Date(result.firstSeenAt);
        user.lastSeenAt = new Date(result.lastSeenAt);
        user.locationHint = result.locationHint;
        user.createdAt = new Date(result.createdAt);
        return { matched: true, user, confidence, distance };
    }
    async getRecentConversations(userId, limit = 3) {
        const query = `
      SELECT 
        id,
        topics,
        action_items as "actionItems",
        occurred_at as "occurredAt"
      FROM conversations
      WHERE user_id = $1
      ORDER BY occurred_at DESC
      LIMIT $2
    `;
        const results = await this.dataSource.query(query, [userId, limit]);
        return results.map((r) => ({
            id: r.id,
            topics: r.topics || [],
            actionItems: r.actionItems || [],
            occurredAt: r.occurredAt,
        }));
    }
    async registerFace(embedding, confidenceScore, source, snapshotUrl, locationHint, existingUserId) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let userId;
            let isNewUser;
            if (existingUserId) {
                const userExists = await queryRunner.query('SELECT id FROM users WHERE id = $1', [existingUserId]);
                if (userExists.length === 0) {
                    throw new common_1.NotFoundException('Existing user not found');
                }
                userId = existingUserId;
                isNewUser = false;
            }
            else {
                const userResult = await queryRunner.query(`INSERT INTO users (name, notes, first_seen_at, last_seen_at, location_hint, created_at)
           VALUES (NULL, NULL, NOW(), NOW(), $1, NOW())
           RETURNING id`, [locationHint]);
                userId = userResult[0].id;
                isNewUser = true;
            }
            const vectorString = `[${embedding.join(',')}]`;
            const faceResult = await queryRunner.query(`INSERT INTO face_embeddings (user_id, embedding, confidence_score, source, snapshot_url, captured_at)
         VALUES ($1, $2::vector, $3, $4, $5, NOW())
         RETURNING id`, [userId, vectorString, confidenceScore, source, snapshotUrl]);
            const faceEmbeddingId = faceResult[0].id;
            await queryRunner.commitTransaction();
            return { userId, faceEmbeddingId, isNewUser };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.FaceEmbeddingsService = FaceEmbeddingsService;
exports.FaceEmbeddingsService = FaceEmbeddingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(face_embedding_entity_1.FaceEmbedding)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], FaceEmbeddingsService);
//# sourceMappingURL=face-embeddings.service.js.map