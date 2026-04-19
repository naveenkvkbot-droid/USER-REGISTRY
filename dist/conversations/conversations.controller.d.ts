import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
export declare class ConversationsController {
    private readonly conversationsService;
    constructor(conversationsService: ConversationsService);
    create(dto: CreateConversationDto): Promise<{
        data: {
            conversationId: string;
        };
        error: null;
    }>;
}
