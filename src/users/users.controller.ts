import {
    Controller,
    Body,
    Param,
    Get,
    Post,
    UseInterceptors,
    ParseIntPipe,
    Patch,
    Delete
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../generated/prisma/client';
import { TransformInterceptor } from '../transform.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDto
    ) {
        return this.usersService.update(id, dto);
    }
}
