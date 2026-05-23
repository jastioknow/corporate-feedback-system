import { useMutation } from '@tanstack/react-query';
import type { LoginInput } from '@corporate/types';
import { authService } from '@/src/shared/api/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { APP_ROUTES } from '@/src/shared/config/api';

export const useLogin = (reset: () => void) => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      toast.success(`С возвращением, ${response.data.user.name}!`);
      reset();
      router.push(APP_ROUTES.USER.PROFILE);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка авторизации';

      if (error.response?.status === 401) {
        toast.error('Неверная почта или пароль');
      } else {
        toast.error(message);
        console.error('[Login Error]:', error);
      }
    },
  });

  return { mutate, isPending };
};
