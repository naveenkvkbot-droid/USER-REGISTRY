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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FaceEmbedding = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let FaceEmbedding = class FaceEmbedding {
    id;
    userId;
    user;
    embedding;
    confidenceScore;
    source;
    snapshotUrl;
    capturedAt;
};
exports.FaceEmbedding = FaceEmbedding;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FaceEmbedding.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], FaceEmbedding.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.faceEmbeddings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], FaceEmbedding.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 5000, name: 'embedding' }),
    __metadata("design:type", String)
], FaceEmbedding.prototype, "embedding", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real', name: 'confidence_score' }),
    __metadata("design:type", Number)
], FaceEmbedding.prototype, "confidenceScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 32, default: 'mediapipe', name: 'source' }),
    __metadata("design:type", String)
], FaceEmbedding.prototype, "source", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true, name: 'snapshot_url' }),
    __metadata("design:type", Object)
], FaceEmbedding.prototype, "snapshotUrl", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'captured_at' }),
    __metadata("design:type", Date)
], FaceEmbedding.prototype, "capturedAt", void 0);
exports.FaceEmbedding = FaceEmbedding = __decorate([
    (0, typeorm_1.Entity)('face_embeddings')
], FaceEmbedding);
//# sourceMappingURL=face-embedding.entity.js.map