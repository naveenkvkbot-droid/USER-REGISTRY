import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    update(id: string, dto: UpdateUserDto): Promise<{
        data: {
            user: {
                id: string;
                name: string | null;
                notes: string | null;
                firstSeenAt: string;
                lastSeenAt: string;
                locationHint: string | null;
            };
        };
        error: null;
    }>;
    getSummary(id: string): Promise<{
        data: {
            user: {
                id: string;
                name: string | null;
                firstSeenAt: string;
                lastSeenAt: string;
            };
            conversations: {
                id: any;
                topics: any;
                actionItems: any;
                occurredAt: any;
            }[];
            faceCount: number;
        };
        error: null;
    }>;
}
