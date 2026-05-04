import {
    Controller,
    Body,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UseInterceptors
} from '@nestjs/common';
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

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
        return this.ordersService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateOrderDto): Promise<Order> {
        return this.ordersService.create(dto);
    }
}
