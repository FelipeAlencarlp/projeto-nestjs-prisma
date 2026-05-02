import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { IsUniqueEmailConstraint } from './decorators/IsUniqueEmail.decorator';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    IsUniqueEmailConstraint
  ]
})
export class UsersModule {}
