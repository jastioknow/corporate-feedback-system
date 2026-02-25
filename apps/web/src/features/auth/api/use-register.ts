import { authService } from '@/src/shared/api/auth.service';
import { useMutation } from '@tanstack/react-query';
import { RegisterInput } from '@corporate/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { USER_ENDPOINTS } from '@/src/shared/config/api';

export const useRegister = (reset: () => void) => {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (response) => {
      toast.success(`Добро пожаловать, ${response.data.user.name}!`);
      reset();
      router.push(USER_ENDPOINTS.PROFILE);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка регистрации';
      toast.error(message);
    },
  });

  return { mutate, isPending };
};
