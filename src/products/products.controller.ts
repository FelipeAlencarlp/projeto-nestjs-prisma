import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseInterceptors,
    ParseIntPipe,
    Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from '../generated/prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { TransformInterceptor } from '../transform.interceptor';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedResult } from '../common/types/paginated-result.type';

@Controller('products')
@UseInterceptors(TransformInterceptor)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('filter') filter?: string
    ): Promise<PaginatedResult<Product>> {
        return this.productsService.findAll(page, limit, filter);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return this.productsService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateProductDto): Promise<Product> {
        return this.productsService.create(dto);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateProductDto
    ): Promise<Product> {
        return this.productsService.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<Product> {
        return this.productsService.delete(id);
    }
}
