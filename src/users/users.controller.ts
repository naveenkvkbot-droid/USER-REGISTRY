import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, dto);

    return {
      data: {
        user: {
          id: user.id,
          name: user.name,
          notes: user.notes,
          firstSeenAt: user.firstSeenAt.toISOString(),
          lastSeenAt: user.lastSeenAt.toISOString(),
          locationHint: user.locationHint,
        },
      },
      error: null,
    };
  }

  @Get(':id/summary')
  async getSummary(@Param('id', ParseUUIDPipe) id: string) {
    const summary = await this.usersService.getUserSummary(id);

    return {
      data: {
        user: {
          id: summary.user.id,
          name: summary.user.name,
          firstSeenAt: summary.user.firstSeenAt.toISOString(),
          lastSeenAt: summary.user.lastSeenAt.toISOString(),
        },
        conversations: summary.conversations.map((c) => ({
          id: c.id,
          topics: c.topics,
          actionItems: c.actionItems,
          occurredAt:
            c.occurredAt instanceof Date
              ? c.occurredAt.toISOString()
              : new Date(c.occurredAt).toISOString(),
        })),
        faceCount: summary.faceCount,
      },
      error: null,
    };
  }
}
