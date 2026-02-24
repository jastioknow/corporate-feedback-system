'use client';

import { useForm } from 'react-hook-form';
import { loginSchema, type LoginSchema } from '../model/login-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '../api/use-login';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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

export function LoginForm() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate, isPending } = useLogin(form.reset);

  const onSubmit = (data: LoginSchema) => {
    mutate(data);
  };

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-black/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Вход</CardTitle>
        <CardDescription>Введите свои данные для доступа к системе</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-zinc-200"
              disabled={isPending}
            >
              {isPending ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
