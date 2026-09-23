import { useQuery } from '@tanstack/react-query';
import { CategoryRepository } from '../../infrastructure/repositories/CategoryRepository';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryRepository.getAll(),
  });
}
