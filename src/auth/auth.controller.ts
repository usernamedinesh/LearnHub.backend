import {Request, Body, Controller, Post, UseFilters, Injectable, HttpCode, HttpStatus, Res, UseGuards, Get } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { SendOtpDto } from './dto/sendOtpDto';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/users/user.dto';
import { UserService } from 'src/users/user.service';
import type {  Response } from 'express';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './role.guard';
import { Roles } from './roles.decorator';
import { userRole } from 'src/schema/type';



@Injectable()
@Controller('auth')
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService) {}

  // @Post('send-otp')
  // sendOtp(@Body() dto: SendOtpDto) {
  //   return this.authService.sendOtp(dto);
  // }

  @Post('/create-new-user')
  async createUsers(@Res({passthrough: true}) res: Response, @Body() createUserDto: CreateUserDto) {
    // const user = await  this.userService.create(createUserDto);
    const { safeUser, accessToken, refreshToken }  = await this.userService.create(createUserDto)

    //Set refreshToken as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, //false for localhost, true in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

   return {
     status: 'success',
     message: 'user created successfully',
     data: safeUser,
     accessToken: accessToken,
   };
  }

  @UseGuards(AuthGuard , RolesGuard)
  @Roles(userRole.Instructor) //TODO: Removes this
  @Get("me")
    async profile(@Request() req: Request) {
      const userId = (req as any).user.userId;
      return await this.userService.profile(userId);
    }

 @HttpCode(HttpStatus.OK)
  @Post('/login')
  async loginUsers(@Res({passthrough: true}) res: Response, @Body() loginUserDto: LoginUserDto) {
    const { safeUser, accessToken, refreshToken }  = await this.userService.login(loginUserDto)


    //Set refreshToken as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, //false for localhost, true in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return {
      status: 'success',
      message: 'user login successfully',
      data: safeUser,
      accessToken: accessToken,
    };
  }
}
