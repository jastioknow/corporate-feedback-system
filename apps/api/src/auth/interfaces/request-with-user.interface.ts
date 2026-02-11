import { Request } from 'express';

export interface ITokenPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: ITokenPayload;
}
