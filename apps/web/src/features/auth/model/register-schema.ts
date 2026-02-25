import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Имя должно быть не менее 3 символов'),
    email: z.string().trim().email('Введите корректный email'),
    password: z.string().min(4, 'Пароль должен быть не менее 4 символов'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
