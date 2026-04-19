import { Repository, DataSource } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
export declare class ConversationsService {
    private readonly conversationRepository;
    private readonly dataSource;
    constructor(conversationRepository: Repository<Conversation>, dataSource: DataSource);
    create(dto: CreateConversationDto): Promise<{
        conversationId: string;
    }>;
    findByUserId(userId: string, limit?: number): Promise<Conversation[]>;
}
