import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminPortalRepository } from '../../infrastructure/repositories/AdminPortalRepository';

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => AdminPortalRepository.getDashboardStats(),
  });
}

export function usePendingOrganizers() {
  return useQuery({
    queryKey: ['admin', 'organizers', 'pending'],
    queryFn: () => AdminPortalRepository.getPendingOrganizers(),
  });
}

export function useApproveOrganizer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, isApproved }: { id: string, isApproved: boolean }) => 
      AdminPortalRepository.approveOrganizer(id, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'organizers', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => AdminPortalRepository.getAllUsers(),
  });
}

export function useLockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AdminPortalRepository.lockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useUnlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AdminPortalRepository.unlockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function usePendingEvents() {
  return useQuery({
    queryKey: ['admin', 'events', 'pending'],
    queryFn: () => AdminPortalRepository.getPendingEvents(),
  });
}

export function useApproveEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AdminPortalRepository.approveEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useRejectEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AdminPortalRepository.rejectEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useBlockEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AdminPortalRepository.blockEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'events', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useAdminOrders() {
  return useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => AdminPortalRepository.getOrders(),
  });
}

export function useAdminPayments() {
  return useQuery({
    queryKey: ['admin', 'payments'],
    queryFn: () => AdminPortalRepository.getPayments(),
  });
}
