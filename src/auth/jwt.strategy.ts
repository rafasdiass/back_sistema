import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token do cabeçalho Authorization
      ignoreExpiration: false, // Não permite tokens expirados
      secretOrKey: configService.getOrThrow('JWT_SECRET'), // Mesma chave secreta usada no módulo JWT
    });
  }

  async validate(payload: any) {
    // O retorno aqui será injetado no `req.user`
    
    return { id: payload.id, role: payload.role };
  

}
}
