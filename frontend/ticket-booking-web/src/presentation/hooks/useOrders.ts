import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderRepository, type CreateOrderRequest } from '../../infrastructure/repositories/OrderRepository';

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data: CreateOrderRequest) => OrderRepository.create(data),
  });
}

export function useOrderDetail(orderId: string) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => OrderRepository.getById(orderId),
    enabled: !!orderId,
  });
}

export function useMyOrders() {
  return useQuery({
    queryKey: ['orders', 'my-orders'],
    queryFn: () => OrderRepository.getMyOrders(),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: string) => OrderRepository.cancel(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'my-orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
    },
  });
}
