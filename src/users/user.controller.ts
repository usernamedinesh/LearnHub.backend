// src/users/users.controller.ts

import { UseGuards,Request, Controller, Get, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { UserService } from './user.service';
import { Param } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
//appy on whole controller
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get("me")
  async profile(@Request() req) {
    const userId = req.user.userId
    return await this.userService.profile(userId);
  }

  // @Post('/create-new-user')
  // async createUsers(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Post('/login')
  // async loginUsers(@Body() loginUserDto: LoginUserDto) {
  //   return this.userService.login(loginUserDto);
  // }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.findOne(id);
  }
}
