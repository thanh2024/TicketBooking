import { useQuery } from '@tanstack/react-query';
import { EventRepository, type EventFilterParams } from '../../infrastructure/repositories/EventRepository';
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository';

export function useEvents(params: EventFilterParams) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => EventRepository.getEvents(params),
    staleTime: 60 * 1000,
  });
}

export function useEventDetail(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => EventRepository.getEventById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useFeaturedEvents(count = 5) {
  return useQuery({
    queryKey: ['events', 'featured', count],
    queryFn: () => EventRepository.getFeaturedEvents(count),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpcomingEvents(count = 5) {
  return useQuery({
    queryKey: ['events', 'upcoming', count],
    queryFn: () => EventRepository.getUpcomingEvents(count),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryRepository.getAll(),
    staleTime: 24 * 60 * 60 * 1000, // Very stable data
  });
}
