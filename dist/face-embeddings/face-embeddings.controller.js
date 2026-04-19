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
exports.FaceEmbeddingsController = void 0;
const common_1 = require("@nestjs/common");
const face_embeddings_service_1 = require("./face-embeddings.service");
const face_search_dto_1 = require("./dto/face-search.dto");
const face_register_dto_1 = require("./dto/face-register.dto");
let FaceEmbeddingsController = class FaceEmbeddingsController {
    faceEmbeddingsService;
    constructor(faceEmbeddingsService) {
        this.faceEmbeddingsService = faceEmbeddingsService;
    }
    async search(dto) {
        const threshold = dto.threshold ?? 0.4;
        const result = await this.faceEmbeddingsService.findClosestMatch(dto.embedding, threshold);
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
        const recentConversations = await this.faceEmbeddingsService.getRecentConversations(result.user.id, 3);
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
                recentConversations: recentConversations.map(c => ({
                    topics: c.topics,
                    actionItems: c.actionItems,
                    occurredAt: c.occurredAt instanceof Date
                        ? c.occurredAt.toISOString()
                        : c.occurredAt,
                })),
            },
            error: null,
        };
    }
    async register(dto) {
        const result = await this.faceEmbeddingsService.registerFace(dto.embedding, dto.confidenceScore, dto.source ?? 'mediapipe', dto.snapshotUrl ?? null, dto.locationHint ?? null, dto.existingUserId ?? null);
        return {
            data: {
                userId: result.userId,
                faceEmbeddingId: result.faceEmbeddingId,
                isNewUser: result.isNewUser,
            },
            error: null,
        };
    }
};
exports.FaceEmbeddingsController = FaceEmbeddingsController;
__decorate([
    (0, common_1.Post)('search'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [face_search_dto_1.FaceSearchDto]),
    __metadata("design:returntype", Promise)
], FaceEmbeddingsController.prototype, "search", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [face_register_dto_1.FaceRegisterDto]),
    __metadata("design:returntype", Promise)
], FaceEmbeddingsController.prototype, "register", null);
exports.FaceEmbeddingsController = FaceEmbeddingsController = __decorate([
    (0, common_1.Controller)('faces'),
    __metadata("design:paramtypes", [face_embeddings_service_1.FaceEmbeddingsService])
], FaceEmbeddingsController);
//# sourceMappingURL=face-embeddings.controller.js.map