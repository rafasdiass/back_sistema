import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(),context.getClass()]);
  
    // Se nenhuma role for especificada, permite o acesso.
    if (!roles || roles.length === 0) return true;
  
    const { user } = context.switchToHttp().getRequest();
  
    // Se não houver usuário autenticado ou role do usuário não for autorizada, lança exceção.
    if (!user || !roles.includes(user.role)) {
      throw new UnauthorizedException('User does not have the required role.');
    }
    console.log(user.role);
    // Usuário está autenticado e autorizado.
    return true;
  }
}
