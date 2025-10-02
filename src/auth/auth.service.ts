import { Injectable, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { SendOtpDto } from './dto/sendOtpDto';
import { JwtService } from '@nestjs/jwt';
import { userRole } from 'src/schema/type';
import { env } from 'src/config/env.config';
import type { Response ,Request} from 'express';


export interface JwtPayload {
  userId: number;
  role: userRole;
}

@Injectable()
export class AuthService {
    constructor(
        private  jwtService: JwtService
    ) {}

    async generateTokens(payload: JwtPayload): Promise<{ accessToken: string; refreshToken: string }> {
        const accessToken = this.jwtService.sign(payload, {expiresIn: "15m"})

        const refreshToken = this.jwtService.sign(payload, {expiresIn: "7d",secret: env.JWT_REFRESH_SECRET})
        return {refreshToken, accessToken}
    }

@Post('refresh')
async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  const token = req.cookies['refreshToken'];
  if (!token) throw new UnauthorizedException();

  try {
    const payload = await this.jwtService.verifyAsync(token);

    // Optionally check tokenVersion or stored refreshToken in DB
    const newTokens = await this.generateTokens({
      userId: payload.userId,
      role: payload.role,
    });

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: newTokens.accessToken,
    };
  } catch (err) {
    throw new UnauthorizedException('Invalid refresh token');
  }
}
}
