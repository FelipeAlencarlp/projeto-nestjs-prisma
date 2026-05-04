import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Product } from '../generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<Product[]> {
        return await this.prisma.product.findMany();
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id }
        });

        if (!product) {
            throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
        }

        return product;
    }

    async create(dto: CreateProductDto) {
        return await this.prisma.$transaction(async (tx) => {
            return await tx.product.create({
                data: { ...dto }
            });
        });
    }

    async update(id: number, dto: UpdateProductDto) {
        return await this.prisma.$transaction(async (tx) => {
            const product = await this.findOne(id);

            return await tx.product.update({
                where: { id: product.id },
                data: dto
            });
        });
    }

    async delete(id: number) {
        return await this.prisma.$transaction(async (tx) => {
            const product = await this.findOne(id);

            return await tx.product.delete({
                where: { id: product.id }
            });
        });
    }
}
