import type { LoginInput } from '@corporate/types';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto implements LoginInput {
  @IsEmail({}, { message: 'Некорректный формат email' })
  email: string;

  @IsString()
  @MinLength(4, { message: 'Пароль должен быть не менее 4 символов' })
  password: string;
}
