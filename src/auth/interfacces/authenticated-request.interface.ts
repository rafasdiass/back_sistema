// src/auth/interfaces/authenticated-request.interface.ts
import { Request } from 'express';

/**
 * Exemplo de payload JWT.
 * Ajuste conforme a forma como você define `role`, `userId`, etc.
 */
export interface JwtPayload {
  role: string;
  userId: string;
  // ...outros campos que vêm no token
}

/**
 * Estende o Request do Express, adicionando a propriedade `user`.
 */
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
