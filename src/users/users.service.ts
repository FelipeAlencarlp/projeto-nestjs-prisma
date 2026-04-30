import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '../generated/prisma/client';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<User[]> { 
        const users = await this.prisma.user.findMany();
        return users;
    }
}
