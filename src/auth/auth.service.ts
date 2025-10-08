import { Injectable, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
// import { SendOtpDto } from './dto/sendOtpDto';
import { generateOtp, getOtpExpiry } from 'src/otp/otp.utils';
import { EmailService } from 'src/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { userRole } from 'src/schema/type';
import { env } from 'src/config/env.config';
import type { Response ,Request} from 'express';
import { OtpVerificationDto } from './dto/otpVerificationDto';
import { db } from 'src/config/db';
import { eq } from 'drizzle-orm';
import { otp, users } from 'src/schema';


export interface JwtPayload {
  userId: number;
  role: userRole;
  tokenVersion: number;
}

@Injectable()
export class AuthService {
    constructor(
        private  jwtService: JwtService,
        private readonly emailServie: EmailService
    ) {}

async generateTokens(payload: JwtPayload): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.jwtService.sign(payload, {expiresIn: "15m"})
    const refreshToken = this.jwtService.sign(payload, {expiresIn: "7d",secret: env.JWT_REFRESH_SECRET})
    return {refreshToken, accessToken}
}

@Post('refresh')
async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  const token: string = req.cookies['refreshToken'] as string;
  if (!token) throw new UnauthorizedException();

  try {
    const payload = await this.jwtService.verifyAsync(token);

    // Optionally check tokenVersion or stored refreshToken in DB
    const newTokens = await this.generateTokens({
      userId: payload.userId,
      role: payload.role,
      tokenVersion: 0
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
    console.error("Error: ", err)
    throw new UnauthorizedException('Invalid refresh token');
  }
 }

 async otpVerifyCodeSend(otpVerifyCode: OtpVerificationDto, userId: number){
  // Check the email is exist in User schema 
  // I have created an another Schema OTP for strong otp
  // So if the id is already exit in otp shcema then just update the otp
  // Then update send the OTP to the email
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  if (!user || user.email !== otpVerifyCode.email) { 
    throw new Error(`User not found or email mismatched`)
  }

  // Check if the OTP record exists for this user
  const existingOtp = await db.query.otp.findFirst({
    where: eq(otp.userId, userId)
  });
  const OTP = generateOtp(6);
  const expiresAt = getOtpExpiry(3); 

  if (existingOtp) {
    // update exising user OTP
    await db.update(otp).set({
      otp: OTP,
      expiresAt,
      usedAt: null //reset usage
    }).where(eq(otp.userId, userId))
      
  } else { 
    // Create new OTP record 
    await db.insert(otp).values({
      userId, 
      otp: OTP,
      createdAt: new Date(),
      expiresAt
    });
  }

  //SEND HERE OTP
  await this.emailServie.sendOtpEmail(otpVerifyCode.email, OTP );
  return { 
    success: true,
    message:"OTP Send Sucessfully!",
     data: {
        userId: user.id,
        email: user.email,
        otpExpiresAt: expiresAt,
        otp: OTP,
      },
  }
 }
}

