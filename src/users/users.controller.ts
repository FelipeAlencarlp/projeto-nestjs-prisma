import {
    Controller,
    Body,
    Param,
    Get,
    Post,
    UseInterceptors,
    ParseIntPipe,
    Patch,
    Delete,
    Query
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../generated/prisma/client';
import { TransformInterceptor } from '../transform.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedResult } from 'src/common/types/paginated-result.type';

@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Query('filter') filter?: string
    ): Promise<PaginatedResult<User>> {
        return this.usersService.findAll(page, limit, filter);
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateUserDto): Promise<User> {
        return this.usersService.create(dto);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto
    ): Promise<User> {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<User> {
        return this.usersService.delete(id);
    }
}
