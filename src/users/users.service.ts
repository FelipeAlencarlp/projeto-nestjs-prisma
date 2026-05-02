import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: id }
        });

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não existe.`);
        }

        return user;
    }

    async findOneByEmail(email: string) {
        const user = await this.prisma.user.findFirst({
            where: { email: email }
        });

        if (!user) {
            throw new NotFoundException(`Usuário com e-mail ${email} não existe.`)
        }

        return user;
    }

    async create(createUserDto: CreateUserDto) {
        return await this.prisma.$transaction(async (tx) => {
            return await tx.user.create({
                data: { ...createUserDto }
            });
        });
    }
}
