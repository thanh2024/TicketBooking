import { useQuery } from '@tanstack/react-query';
import { ReviewRepository } from '../../infrastructure/repositories/ReviewRepository';

export function useReviews(eventId: string) {
  return useQuery({
    queryKey: ['reviews', eventId],
    queryFn: () => ReviewRepository.getByEventId(eventId),
    enabled: !!eventId,
  });
}
