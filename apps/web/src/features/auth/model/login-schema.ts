import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().trim().email('Введите корректный email'),

    password: z.string().min(4, 'Пароль должен быть не менее 4 символов'),
  })
  .strict();

export type LoginSchema = z.infer<typeof loginSchema>;
