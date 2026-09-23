import { useMutation, useQuery } from '@tanstack/react-query';
import { LoginUseCase, RegisterUseCase, GetMeUseCase, LogoutUseCase } from '../../application/auth/AuthUseCases';
import type { LoginFormData, RegisterFormData } from '../../application/auth/AuthSchemas';
import { useAuthStore } from '../../app/store/authStore';
import { tokenStorage } from '../../infrastructure/storage/tokenStorage';

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginFormData) => LoginUseCase(data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: Omit<RegisterFormData, 'confirmPassword'>) => RegisterUseCase(data),
  });
}

export function useGetMe() {
  const hasToken = !!tokenStorage.getAccessToken();

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: GetMeUseCase,
    enabled: hasToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogout() {
  return {
    logout: LogoutUseCase,
  };
}

export function useAuth() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  return { user, isAuthenticated, isLoading, logout: LogoutUseCase };
}
