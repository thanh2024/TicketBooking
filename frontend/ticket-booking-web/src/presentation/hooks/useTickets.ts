import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TicketRepository } from '../../infrastructure/repositories/TicketRepository';

export function useMyTickets() {
  return useQuery({
    queryKey: ['tickets', 'my-tickets'],
    queryFn: () => TicketRepository.getMyTickets(),
  });
}

export function useTicketDetail(ticketId: string) {
  return useQuery({
    queryKey: ['tickets', ticketId],
    queryFn: () => TicketRepository.getById(ticketId),
    enabled: !!ticketId,
  });
}

export function useCheckInTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ticketCode: string) => TicketRepository.checkIn(ticketCode),
    onSuccess: () => {
      // Invalidate relevant queries if needed, though this is an organizer action
      queryClient.invalidateQueries({ queryKey: ['organizer', 'check-in-stats'] });
    },
  });
}
