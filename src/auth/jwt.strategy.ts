import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secreto', // cambiá esto por tu valor real
    });
  }

  async validate(payload: any) {
    // lo que devuelvas se guarda en req.user
    return {
      id: payload.sub,
      username: payload.username,
      perfil: payload.perfil,
    };
  }
}
