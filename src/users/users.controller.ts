import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from './schemas/user.schema';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my-profile')
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Perfil del usuario autenticado', type: User })
  @ApiUnauthorizedResponse({ description: 'Token inválido o ausente' })
  async getMiPerfil(@Req() req) {
    return this.usersService.getPerfil(req.user.id);
  }
}
