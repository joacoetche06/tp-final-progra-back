// src/auth/auth.controller.ts

import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // --- Registro con subida de imagen ---
  @Post('register')
  @UseInterceptors(
    FileInterceptor('imagenPerfil', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `imagenPerfil-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async register(
    @Body() dto: RegisterDto,
    @UploadedFile() imagenPerfil: Express.Multer.File,
  ) {
    return this.authService.register(dto, imagenPerfil);
  }

  // --- Login devuelve token de 15 minutos ---
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // --- Autorizar: valida un token pasado en el body ---
  @Post('authorize')
  async authorize(@Body('token') token: string) {
    try {
      const payload = this.authService.verifyToken(token);
      return { valid: true, payload };
    } catch (err) {
      throw new UnauthorizedException('Token inválido o vencido');
    }
  }

  // --- Refresh: genera un nuevo token, solo si el actual es válido ---
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() req) {
    const user = req.user;
    if (!user) throw new BadRequestException('No se encontró usuario en token');
    const newToken = this.authService.refreshToken(user);
    return { access_token: newToken };
  }
}
