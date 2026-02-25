import type { Role } from '@corporate/db';

export type AuthResponse = {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role;
  };
  access: string;
};

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  name: string;
}
