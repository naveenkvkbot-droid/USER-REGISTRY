"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const face_embeddings_module_1 = require("./face-embeddings/face-embeddings.module");
const conversations_module_1 = require("./conversations/conversations.module");
const _001_initial_schema_1 = require("./database/migrations/001_initial_schema");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DATABASE_HOST', 'localhost'),
                    port: configService.get('DATABASE_PORT', 5432),
                    database: configService.get('DATABASE_NAME', 'user_registry'),
                    username: configService.get('DATABASE_USER', 'postgres'),
                    password: configService.get('DATABASE_PASSWORD', 'dev_password'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: false,
                    migrations: [_001_initial_schema_1.InitialSchema001],
                    migrationsRun: true,
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            face_embeddings_module_1.FaceEmbeddingsModule,
            conversations_module_1.ConversationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map