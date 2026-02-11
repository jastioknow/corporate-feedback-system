import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.authService.login(dto);
    this.authService.addRefreshFromCookie(res, tokens.refresh);
    return { user, access: tokens.access };
  }

  @UsePipes(ValidationPipe)
  @Post('/register')
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.authService.register(dto);
    this.authService.addRefreshFromCookie(res, tokens.refresh);
    return { user, access: tokens.access };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  getProfile(@Req() req: RequestWithUser) {
    const user = req.user;
    return { id: user.sub, email: user.email, name: user.name, role: user.role };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('/refresh')
  async refresh(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.authService.refreshTokens(req.user);
    this.authService.addRefreshFromCookie(res, tokens.refresh);
    return { user, access: tokens.access };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.removeRefreshFromCookie(res);
    return;
  }
}
