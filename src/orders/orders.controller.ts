import {
    Controller,
    Body,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseInterceptors,
    Query
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TransformInterceptor } from '../transform.interceptor';
import { Order } from '../generated/prisma/client';
import { PaginatedResult } from '../common/types/paginated-result.type';

@Controller('orders')
@UseInterceptors(TransformInterceptor)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string
    ): Promise<PaginatedResult<Order>> {
        return this.ordersService.findAll(page, limit);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
        return this.ordersService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateOrderDto): Promise<Order> {
        return this.ordersService.create(dto);
    }
}
