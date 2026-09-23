import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrganizerPortalRepository } from '../../infrastructure/repositories/OrganizerPortalRepository';

export function useRegisterOrganizer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      phone: string;
      email: string;
      logoUrl?: string;
    }) => OrganizerPortalRepository.registerOrganizer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useOrganizerStats() {
  return useQuery({
    queryKey: ['organizer', 'stats'],
    queryFn: () => OrganizerPortalRepository.getDashboardStats(),
  });
}

export function useOrganizerRevenue() {
  return useQuery({
    queryKey: ['organizer', 'revenue'],
    queryFn: () => OrganizerPortalRepository.getRevenue(),
  });
}

export function useOrganizerEvents() {
  return useQuery({
    queryKey: ['organizer', 'events'],
    queryFn: () => OrganizerPortalRepository.getMyEvents(),
  });
}

export function useOrganizerOrders(eventId?: string) {
  return useQuery({
    queryKey: ['organizer', 'orders', eventId],
    queryFn: () => OrganizerPortalRepository.getOrganizerOrders(eventId),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => OrganizerPortalRepository.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['organizer', 'stats'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: any }) => OrganizerPortalRepository.updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['organizer', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
    },
  });
}

export function useSubmitEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => OrganizerPortalRepository.submitEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['organizer', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['events', id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => OrganizerPortalRepository.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer', 'events'] });
      queryClient.invalidateQueries({ queryKey: ['organizer', 'stats'] });
    },
  });
}

export function useScanTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ticketCode: string) => OrganizerPortalRepository.scanTicket(ticketCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizer', 'stats'] });
    },
  });
}
