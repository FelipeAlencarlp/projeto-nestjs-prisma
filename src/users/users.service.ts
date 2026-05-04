import {
    Injectable, BadRequestException, NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não existe.`);
        }

        return user;
    }

    async findOneByEmail(email: string) {
        return await this.prisma.user.findFirst({
            where: { email }
        });
    }

    async create(dto: CreateUserDto) {
        return await this.prisma.user.create({
            data: { ...dto }
        });
    }

    async update(id: number, dto: UpdateUserDto) {
        if (dto.email) {
            const user = await this.findOneByEmail(dto.email);

            if (user && user.id !== id) {
                throw new BadRequestException(
                    'Este e-mail já está sendo utilizado.'
                );
            }
        }

        return await this.prisma.user.update({
            where: { id },
            data: { ...dto }
        });
    }

    async delete(id: number) {
        const user = await this.findOne(id);

        return await this.prisma.user.delete({
            where: { id: user.id }
        });
    }
}
