import { Category } from '@corporate/db';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Заголовок слишком короткий' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Описание должно быть более подробным' })
  content: string;

  @IsEnum(Category, { message: 'Выберите корректную категорию' })
  category: Category;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @IsBoolean()
  @IsOptional()
  isPrivate?: boolean;
}
