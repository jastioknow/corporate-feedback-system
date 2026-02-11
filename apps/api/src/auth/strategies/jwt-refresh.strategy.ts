import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return req?.cookies?.['refresh'];
      },
      ignoreExpiration: false,
      secretOrKey: process.env['JWT_SECRET_REFRESH'] || 'secret-refresh',
      // passReqToCallback: true,
    });
  }

  validate(
    // req: Request,
    payload: { sub: string; email: string; role: string },
  ) {
    // const refresh = req?.cookies?.refresh as string;
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
