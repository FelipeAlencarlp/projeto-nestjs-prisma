import {
    Injectable,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Order } from '../generated/prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { paginate } from '../common/pagination/pagination';
import { PaginatedResult } from '../common/types/paginated-result.type';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(page: string, limit: string): Promise<PaginatedResult<Order>> {
        return paginate(
            this.prisma.order,
            { page, limit },
            { include: { user: true, products: true } }
        );
    }

    async findOne(id: number) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { user: true, products: true }
        });

        if (!order) {
            throw new NotFoundException(
                `Ordem com ID ${id} não encontrada.`
            );
        }

        return order;
    }

    async findUser(id: number, tx: any) {
        const user = await tx.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }

        return user;
    }

    async findProducts(ids: number[], tx: any) {
        const products = await tx.product.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        const idsExists = new Set(products.map(p => p.id));
        const invalidIds = ids.filter(id => !idsExists.has(id));

        if (invalidIds.length > 0) {
            throw new BadRequestException(
                `O(s) produto(s) com ID(s) ${invalidIds.join(', ')} não existe(m).`
            );
        }

        return products;
    }

    async create(dto: CreateOrderDto) {
        // garantindo atômicidade - sucesso ou rollback
        return await this.prisma.$transaction(async (tx) => {
            if (!dto.userId || !dto.productIds) {
                throw new BadRequestException(
                    'ID do usuário e ID de produto são Obrigatórios'
                );
            }

            const user = await this.findUser(dto.userId, tx);
            const products = await this.findProducts(dto.productIds, tx);
        
            const total = products.reduce(
                (acc, item) => acc.plus(item.price),
                new Prisma.Decimal(0)
            );

            return await tx.order.create({
                data: {
                    userId: user.id,
                    products: {
                        connect: products.map(p => ({ id: p.id }))
                                // Transformando number[] em {id: number}[]
                    },
                    total: total
                },
                include: {
                    user: true,
                    products: true
                }
            });
        });
    }
}
