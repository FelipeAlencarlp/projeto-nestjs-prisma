import {
    Injectable,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Order } from '../generated/prisma/client';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<Order[]> {
        return this.prisma.order.findMany({
            include: { user: true, products: true }
        });
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

    async findUser(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
        }

        return user;
    }

    async findProducts(ids: number[]) {
        const products = await this.prisma.product.findMany({
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

    async create(userId: number, productIds: number[]) {
        // garantindo atômicidade - sucesso ou rollback
        return await this.prisma.$transaction(async (tx) => {
            const user = await this.findUser(userId);
            const products = await this.findProducts(productIds);
        
            const total = products.reduce(
                (acc, item) => acc.plus(item.price),
                new Prisma.Decimal(0)
            );

            return await tx.order.create({
                data: {
                    userId: user.id,
                    products: {
                        connect: productIds.map(id => ({ id }))
                                // Transformando number[] em {id: number}[]
                    },
                    total: total
                },
                include: {
                    products: true
                }
            });
        });
    }
}
