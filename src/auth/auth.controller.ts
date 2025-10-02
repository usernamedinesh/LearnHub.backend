import { Body, Controller, Post, UseFilters, Injectable } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/filters/http-exception.filter';
import { SendOtpDto } from './dto/sendOtpDto';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from 'src/users/user.dto';
import { UserService } from 'src/users/user.service';



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
  async createUsers(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/login')
  async loginUsers(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
    }
}
