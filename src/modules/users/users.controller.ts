import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'entities/user.entity';
import { PaginatedResult } from 'interfaces/paginated-result.interface';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { ApiOkResponse } from '@nestjs/swagger/dist/index';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ description: 'List all users(for development purposes)' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.usersService.paginate(page);
  }

  @ApiOkResponse({ description: 'Return user data from id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id);
  }
}
