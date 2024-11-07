import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() { email, password }: { email: string; password: string }) {
    return this.usersService.createUser(email, password);
  }

  @Get(':email')
  async getUser(@Param('email') email: string) {
    return this.usersService.findUserByEmail(email);
  }
}
