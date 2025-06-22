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
  RawBodyRequest,
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
  @UseInterceptors(FileInterceptor('imagenPerfil'))
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('Request content-type:', req.headers['content-type']);
    // Removed req.isMultipart() as it does not exist on Request
    console.log('File metadata:', {
      fieldname: file?.fieldname,
      originalname: file?.originalname,
      size: file?.size,
    });
    return this.authService.register(dto, file);
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
