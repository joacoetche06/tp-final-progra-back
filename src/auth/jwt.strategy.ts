import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secreto',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    console.log('Payload recibido en JwtStrategy:', payload);
    return {
      id: payload.sub,
      username: payload.username,
      perfil: payload.perfil,
    };
  }
}
