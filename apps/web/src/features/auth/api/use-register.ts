import { useMutation } from '@tanstack/react-query';
import type { RegisterInput } from '@corporate/types';
import { authService } from '@/src/shared/api/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { APP_ROUTES } from '@/src/shared/config/api';

export const useRegister = (reset: () => void) => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (response) => {
      toast.success(`Аккаунт успешно создан, ${response.data.user.name}!`);
      reset();
      router.push(APP_ROUTES.USER.PROFILE);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка регистрации';

      toast.error(message);
      console.error('[Register Error]:', error);
    },
  });

  return { mutate, isPending };
};
