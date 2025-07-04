import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiBody,
} from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Perfil del usuario actual
  @UseGuards(JwtAuthGuard)
  @Get('my-profile')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Perfil del usuario autenticado', type: User })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  async getMiPerfil(@Req() req) {
    return this.usersService.getPerfil(req.user.id);
  }

  // Listar todos los usuarios (solo admin)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ 
    description: 'Listado de todos los usuarios', 
    type: [User] 
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  @ApiForbiddenResponse({ description: 'Acceso denegado (no es administrador)' })
  async listarUsuarios() {
    return this.usersService.findAll();
  }

  // Crear nuevo usuario (solo admin)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ 
    description: 'Usuario creado exitosamente', 
    type: User 
  })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  @ApiForbiddenResponse({ description: 'Acceso denegado (no es administrador)' })
  async crearUsuario(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Deshabilitar usuario (baja lógica)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Usuario deshabilitado exitosamente', type: User })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  @ApiForbiddenResponse({ description: 'Acceso denegado (no es administrador)' })
  async deshabilitarUsuario(@Param('id') id: string) {
    return this.usersService.disableUser(id);
  }

  // Reactivar usuario (alta lógica)
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/reactivar')
  @HttpCode(HttpStatus.OK) // 👈 Fuerza el código 200
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Usuario reactivado exitosamente', type: User })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  @ApiForbiddenResponse({ description: 'Acceso denegado (no es administrador)' })
  async reactivarUsuario(@Param('id') id: string) {
    return this.usersService.enableUser(id);
  }
}