// src/estadisticas/estadisticas.controller.ts
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { Request } from 'express';
import { EstadisticasService } from './estadisticas.service';

@Controller('estadisticas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('publicaciones-por-usuario')
  async publicacionesPorUsuario(
    @Query('from') from: string,
    @Query('to') to: string,
    @Req() req: Request,
  ) {
    this.validarAdmin(req);
    return this.estadisticasService.getPublicacionesPorUsuario(from, to);
  }

  @Get('comentarios-por-dia')
  async comentariosPorDia(
    @Query('from') from: string,
    @Query('to') to: string,
    @Req() req: Request,
  ) {
    this.validarAdmin(req);
    return this.estadisticasService.getComentariosPorDia(from, to);
  }

  @Get('comentarios-por-publicacion')
  async comentariosPorPublicacion(
    @Query('from') from: string,
    @Query('to') to: string,
    @Req() req: Request,
  ) {
    this.validarAdmin(req);
    return this.estadisticasService.getComentariosPorPublicacion(from, to);
  }

  private validarAdmin(req: Request) {
    const user = req.user as any;
    if (user?.perfil !== 'admin') {
      throw new ForbiddenException('Solo administradores pueden acceder');
    }
  }
}
