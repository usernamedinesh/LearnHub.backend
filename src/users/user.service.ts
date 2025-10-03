//handle db logics

import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { db } from 'src/config/db';
import { users } from '../schema/users';
import { eq, or } from 'drizzle-orm';
import * as bcrypt from 'bcryptjs';
import { SafeUser, User, userRole } from 'src/schema/type';
import { AuthService } from 'src/auth/auth.service';
import { omit } from 'zod/mini';

type LoginReturn = {
  safeUser: SafeUser;
  accessToken: string;
  refreshToken: string;
};


@Injectable()
export class UserService {

    constructor(
        private  authService: AuthService
    ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const userToCreate = {
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
      password: hashedPassword,
      role: createUserDto.role ?? userRole.User,
      isActive: createUserDto.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    try {
      //check here if the email and phoneNumber is already exist in db
      const exisintUser = await db.query.users.findFirst({
        where: or(
          eq(users.email, createUserDto.email),
          eq(users.phoneNumber, createUserDto.phoneNumber ?? ''),
        ),
      });
      if (exisintUser) {
        throw new ConflictException(
          exisintUser.email === createUserDto.email
            ? 'Email already exist'
            : 'phoneNumber already exist',
        );
      }
      const [newUser] = await db.insert(users).values(userToCreate).returning();

      // Don't return the password

   // Use the existing tokenVersion from DB
   const tokenVersion = newUser.tokenVersion ?? 0;

    const token = await this.authService.generateTokens({userId: newUser.id, role: newUser.role as userRole, tokenVersion})
    //save refreshToken in db
await db.update(users)
  .set({ refreshToken: await bcrypt.hash(token.refreshToken, 10) })
  .where(eq(users.id, newUser.id));


     const { password: _password, ...safeUser } = newUser as User;

    return { safeUser: safeUser as SafeUser, accessToken: token.accessToken, refreshToken: token.refreshToken };


    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Database error');
    }
  }

  async findAll() {
    try {
      const allUsers = await db.select().from(users);
      if (allUsers.length === 0) {
        return {
          status: 'success',
          message: 'No user found!',
        };
      }
      const usersWithoutPasswords = allUsers.map(
        ({ password: _password, ...rest }) => rest,
      );

      return {
        status: 'success',
        message: 'user fetched successfully',
        data: usersWithoutPasswords,
      };
    } catch (error) {
      console.error('DB error:', error);
      return {
        status: 'error',
        message: 'Internal server error',
      };
    }
  }

    //me route
  async profile(userId:string) {

    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(userId, 10)),
    });

    const { password: _password, ...safeUser } = user;
    return {
      status: 'success',
      data: safeUser,
    };
   }

  async login(loginDto: LoginUserDto) {
    const { email, password, phoneNumber } = loginDto;

    const user = await db.query.users.findFirst({
      where: or(
        email ? eq(users.email, email) : undefined,
        phoneNumber ? eq(users.phoneNumber, phoneNumber) : undefined,
      ),
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid password');
    }

   // Use the existing tokenVersion from DB
   const tokenVersion = user.tokenVersion ?? 0;

    const token = await this.authService.generateTokens({userId: user.id, role: user.role as userRole, tokenVersion})
    //save refreshToken in db
await db.update(users)
  .set({ refreshToken: await bcrypt.hash(token.refreshToken, 10) })
  .where(eq(users.id, user.id));

    const { password: _password, ...safeUser } = user;
    return { safeUser, accessToken: token.accessToken, refreshToken: token.refreshToken };

  }

  async findOne(id: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, parseInt(id, 10)),
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const { password: _password, ...safeUser } = user;
    return {
      status: 'success',
      data: safeUser,
    };
  }
}
