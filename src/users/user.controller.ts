// src/users/users.controller.ts

import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';

@Controller('users')
//appy on whole controller
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Post('/create-new-user')
  async createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  async loginUsers(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  // @Get(':id')
  // async getUserById(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }
}
// import { Param } from 'drizzle-orm';
