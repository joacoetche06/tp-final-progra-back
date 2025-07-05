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
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { User } from '../users/schemas/user.schema';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('imagenPerfil'))
  @ApiCreatedResponse({
    description: 'Usuario registrado con éxito',
    type: User,
  })
  @ApiBadRequestResponse({ description: 'Datos inválidos' })
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.register(dto, file);
  }

  @Post('login')
  @ApiOkResponse({ description: 'Login exitoso' })
  @ApiBadRequestResponse({ description: 'Credenciales inválidas' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('authorize')
  @ApiOkResponse({ description: 'Token válido' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o vencido' })
  async authorize(@Body('token') token: string) {
    const payload = this.authService.verifyToken(token);
    return { valid: true, payload };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Token renovado exitosamente' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  async refresh(@Req() req) {
    const user = req.user;
    if (!user) throw new BadRequestException('No se encontró usuario en token');
    const newToken = this.authService.refreshToken(user);
    return { access_token: newToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Datos del usuario actual' })
  async getCurrentUser(@Req() req) {
    console.log('Obteniendo usuario actual desde el token:', req.user);
    const userId = req.user.id;
    const user = await this.authService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { password, ...safeUser } = user.toObject();
    return safeUser;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh-token')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Token renovado exitosamente' })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  async refreshToken(@Req() req) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Verifica si el token está a punto de expirar (opcional)
    const token = req.headers.authorization?.split(' ')[1];
    if (token && this.authService.isTokenExpired(token)) {
      throw new UnauthorizedException('Token ya expirado');
    }

    // Genera un nuevo token
    const newToken = this.authService.generateToken(user);
    return { access_token: newToken };
  }
}
