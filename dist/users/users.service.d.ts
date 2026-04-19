import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findById(id: string): Promise<User | null>;
    findByIdOrThrow(id: string): Promise<User>;
    create(data?: Partial<User>): Promise<User>;
    update(id: string, dto: UpdateUserDto): Promise<User>;
    updateLastSeenAt(id: string, lastSeenAt: Date): Promise<void>;
    getUserSummary(id: string): Promise<{
        user: User;
        conversations: any[];
        faceCount: number;
    }>;
}
