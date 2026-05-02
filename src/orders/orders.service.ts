import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    async createOrder(userId: number, productIds: number[]) {
        // garantindo atômicidade - sucesso ou rollback
        return await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
                where: {
                    id: userId
                }
            });

            if (!user) {
                throw new NotFoundException(`Usuário com ID ${userId} não existe`);
            }
            
            const products = await tx.product.findMany({
                where: {
                    id: {
                        in: productIds
                    }
                }
            });

            if (products.length === 0) {
                throw new BadRequestException('Não é possível criar uma ordem sem produto.');
            }

            const idsExists = new Set(products.map(p => p.id));
            const invalidIds = productIds.filter(id => !idsExists.has(id));

            if (invalidIds.length > 0) {
                throw new BadRequestException(
                    `O(s) produto(s) com ID(s) ${invalidIds.join(', ')} não existe(m).`
                );
            }
            
            const total = products.reduce(
                 (acc, item) => acc.plus(item.price),
                 new Prisma.Decimal(0)
            );

            return await tx.order.create({
                data: {
                    userId: userId,
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
