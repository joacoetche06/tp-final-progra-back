// src/auth/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Usar 'perfil' en lugar de 'role'
    if (user?.perfil !== 'admin') {
      throw new ForbiddenException('Acceso restringido a administradores');
    }
    
    return true;
  }
}