// src/auth/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.perfil) {
      throw new ForbiddenException('Acceso denegado. Usuario no autenticado.');
    }

    // Por ahora, dejamos pasar si el usuario tiene cualquier rol válido
    return true;
  }
}
