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
exports.ConversationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const conversation_entity_1 = require("./entities/conversation.entity");
let ConversationsService = class ConversationsService {
    conversationRepository;
    dataSource;
    constructor(conversationRepository, dataSource) {
        this.conversationRepository = conversationRepository;
        this.dataSource = dataSource;
    }
    async create(dto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const userExists = await queryRunner.query('SELECT id FROM users WHERE id = $1', [dto.userId]);
            if (userExists.length === 0) {
                throw new common_1.NotFoundException('User not found');
            }
            const result = await queryRunner.query(`INSERT INTO conversations (user_id, transcript, topics, action_items, duration_seconds, location_hint, occurred_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`, [
                dto.userId,
                dto.transcript,
                JSON.stringify(dto.topics),
                JSON.stringify(dto.actionItems),
                dto.durationSeconds,
                dto.locationHint,
                dto.occurredAt,
            ]);
            const conversationId = result[0].id;
            await queryRunner.query(`UPDATE users SET last_seen_at = $1 WHERE id = $2`, [dto.occurredAt, dto.userId]);
            await queryRunner.commitTransaction();
            return { conversationId };
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findByUserId(userId, limit = 10) {
        return this.conversationRepository.find({
            where: { userId },
            order: { occurredAt: 'DESC' },
            take: limit,
        });
    }
};
exports.ConversationsService = ConversationsService;
exports.ConversationsService = ConversationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(conversation_entity_1.Conversation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], ConversationsService);
//# sourceMappingURL=conversations.service.js.map