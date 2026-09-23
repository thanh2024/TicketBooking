import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';

export function useUserProfile() {
  return useQuery({
    queryKey: ['users', 'profile'],
    queryFn: () => UserRepository.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { fullName: string; avatarUrl?: string }) => UserRepository.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'profile'] });
    },
  });
}
