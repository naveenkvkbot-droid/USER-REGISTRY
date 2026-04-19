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
exports.Conversation = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Conversation = class Conversation {
    id;
    userId;
    user;
    transcript;
    topics;
    actionItems;
    durationSeconds;
    locationHint;
    occurredAt;
};
exports.Conversation = Conversation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Conversation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'user_id' }),
    __metadata("design:type", String)
], Conversation.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.conversations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Conversation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Conversation.prototype, "transcript", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '[]' }),
    __metadata("design:type", Array)
], Conversation.prototype, "topics", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '[]', name: 'action_items' }),
    __metadata("design:type", Array)
], Conversation.prototype, "actionItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'duration_seconds' }),
    __metadata("design:type", Number)
], Conversation.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true, name: 'location_hint' }),
    __metadata("design:type", Object)
], Conversation.prototype, "locationHint", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', name: 'occurred_at' }),
    __metadata("design:type", Date)
], Conversation.prototype, "occurredAt", void 0);
exports.Conversation = Conversation = __decorate([
    (0, typeorm_1.Entity)('conversations')
], Conversation);
//# sourceMappingURL=conversation.entity.js.map