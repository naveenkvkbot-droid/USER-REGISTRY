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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async findById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async findByIdOrThrow(id) {
        const user = await this.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async create(data = {}) {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }
    async update(id, dto) {
        const user = await this.findByIdOrThrow(id);
        if (dto.name !== undefined) {
            user.name = dto.name;
        }
        if (dto.notes !== undefined) {
            user.notes = dto.notes;
        }
        return this.userRepository.save(user);
    }
    async updateLastSeenAt(id, lastSeenAt) {
        await this.userRepository.update(id, { lastSeenAt });
    }
    async getUserSummary(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['conversations', 'faceEmbeddings'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const sortedConversations = (user.conversations || [])
            .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
            .map(c => ({
            id: c.id,
            topics: c.topics,
            actionItems: c.actionItems,
            occurredAt: c.occurredAt,
        }));
        return {
            user,
            conversations: sortedConversations,
            faceCount: user.faceEmbeddings?.length || 0,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map