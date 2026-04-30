import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TransformInterceptor } from '../transform.interceptor';
import { Order } from '../generated/prisma/client';

@Controller('orders')
@UseInterceptors(TransformInterceptor)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    async findAll(): Promise<Order[]> {
        return this.ordersService.findAll();
    }

    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.createOrder(
            createOrderDto.id, createOrderDto.productIds
        );
    }
}
