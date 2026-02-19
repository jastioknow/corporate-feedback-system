import { IsString, MinLength } from 'class-validator';
import { LoginDto } from './login.dto';
import type { RegisterInput } from '@corporate/types';

export class RegisterDto extends LoginDto implements RegisterInput {
  @IsString()
  @MinLength(3, { message: 'Имя слишком короткое' })
  name: string;
}
