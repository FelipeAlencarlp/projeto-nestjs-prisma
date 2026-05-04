import {
    Injectable, BadRequestException, NotFoundException
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '../generated/prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { paginate } from '../common/pagination/pagination';
import { PaginatedResult } from '../common/types/paginated-result.type';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(
        page: string,
        limit: string,
        filter?: string
    ): Promise<PaginatedResult<User>> {
        const where = {
            deletedAt: null,
            // se tiver filtro adiciona
            ...(filter && {
                name: { contains: filter, mode: 'insensitive' }
            })
        };

        return paginate(
            this.prisma.user,
            { page, limit },
            { where }
        );
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
            include: { orders: true }
        });

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não existe.`);
        }

        return user;
    }

    async findOneByEmail(email: string) {
        return await this.prisma.user.findFirst({
            where: { email, deletedAt: null }
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

    async remove(id: number) {
        const user = await this.findOne(id);

        return await this.prisma.user.update({
            where: { id: user.id },
            data: { deletedAt: new Date() }
        });
    }

    async restore(id: number) {
        const user = await this.findOne(id);

        return await this.prisma.user.update({
            where: { id: user.id },
            data: { deletedAt: null }
        });
    }
}
