import { Controller, Post, Body } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  async create(@Body() dto: CreateConversationDto) {
    const result = await this.conversationsService.create(dto);

    return {
      data: {
        conversationId: result.conversationId,
      },
      error: null,
    };
  }
}