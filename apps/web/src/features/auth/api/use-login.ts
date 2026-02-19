import { useMutation } from '@tanstack/react-query';
import type { LoginInput } from '@corporate/types';
import { authService } from '@/src/shared/api/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { USER_ENDPOINTS } from '@/src/shared/config/api';

export const useLogin = (reset: () => void) => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      toast.success(`С возвращением, ${response.data.user.name}!`);
      reset();
      router.push(USER_ENDPOINTS.PROFILE);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка авторизации';

      if (error.response?.status === 401) {
        toast.error('Неверный логин или пароль');
      } else {
        toast.error(message);
        console.error('[Login Error]:', error);
      }
    },
  });
};
