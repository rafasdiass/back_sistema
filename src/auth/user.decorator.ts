import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    // O `user` é geralmente adicionado ao request pelo middleware de autenticação (ex.: Passport)
    
    return request.user?.id; // Retorna o ID do usuário
  },
);
