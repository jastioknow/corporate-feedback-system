import type { Role } from '@corporate/db';
import { Request } from 'express';

export interface ITokenPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}

export interface RequestWithUser extends Request {
  user: ITokenPayload;
}
