import { useQuery } from '@tanstack/react-query';
import { TicketTypeRepository } from '../../infrastructure/repositories/TicketTypeRepository';

export function useTicketTypes(eventId: string) {
  return useQuery({
    queryKey: ['ticketTypes', eventId],
    queryFn: () => TicketTypeRepository.getByEventId(eventId),
    enabled: !!eventId,
  });
}
