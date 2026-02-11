import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prismaOrm/prisma.service';

import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { ITokenPayload } from './interfaces/request-with-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
      select: { id: true, name: true, email: true, role: true, password: true },
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }

    const tokens = this.generateTokens(user.id, user.email, user.role, user.name);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return { user: result, tokens };
  }

  async register(dto: RegisterDto) {
    const isUserExists = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });
    if (isUserExists) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.client.user.create({
      data: {
        password: hashedPassword,
        email: dto.email,
        name: dto.name,
      },
      select: { id: true, email: true, role: true, name: true },
    });

    const tokens = this.generateTokens(user.id, user.email, user.role, user.name);

    return { user, tokens };
  }

  async refreshTokens(payload: ITokenPayload) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: payload.sub },
      select: { email: true, id: true, role: true, name: true },
    });
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const tokens = this.generateTokens(user.id, user.email, user.role, user.name);

    return { user, tokens };
  }

  private generateTokens(userId: string, email: string, role: string, name: string) {
    const payload: ITokenPayload = { sub: userId, email, role, name };
    return {
      access: this.jwtService.sign(payload, {
        secret: process.env['JWT_SECRET_ACCESS'] || 'secret-access',
        expiresIn: '1h',
      }),
      refresh: this.jwtService.sign(payload, {
        secret: process.env['JWT_SECRET_REFRESH'] || 'secret-refresh',
        expiresIn: '15d',
      }),
    };
  }

  addRefreshFromCookie(res: Response, refresh: string) {
    res.cookie('refresh', refresh, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 15,
      secure: false,
      sameSite: 'lax',
      path: '/api/auth',
    });
  }
  removeRefreshFromCookie(res: Response) {
    res.cookie('refresh', '', {
      httpOnly: true,
      maxAge: 0,
      secure: false,
      sameSite: 'lax',
      path: '/api/auth',
    });
  }
}
