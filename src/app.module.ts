import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { FaceEmbeddingsModule } from './face-embeddings/face-embeddings.module';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get<number>('DATABASE_PORT', 5432),
        database: configService.get('DATABASE_NAME', 'user_registry'),
        username: configService.get('DATABASE_USER', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'dev_password'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations-disabled-path/**/*.ts'],
        synchronize: true, // Auto-create schema from entities
        migrationsRun: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    FaceEmbeddingsModule,
    ConversationsModule,
  ],
})
export class AppModule {}
