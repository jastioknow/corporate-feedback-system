'use client';

import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterSchema } from '../model/register-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '../api/use-register';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/src/shared/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { Button } from '@/src/shared/ui/button';
import Link from 'next/link';

export function RegisterForm() {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const { mutate, isPending } = useRegister(form.reset);

  const onSubmit = (data: RegisterSchema) => {
    mutate(data);
  };

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-black/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Регистрация</CardTitle>
        <CardDescription>Введите свои данные для доступа к системе</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите имя" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Введите пароль" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Повтор пароля</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Введите повторно пароль"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-zinc-200"
              disabled={isPending}
            >
              {isPending ? 'Создание аккаунта...' : 'Создать'}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-zinc-800 pt-4">
        <p className="text-sm text-zinc-400">
          Уже есть аккаунт?
          <Link
            href="/login"
            className="text-white hover:underline underline-offset-4 ml-1.5"
          >
            Войти
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
