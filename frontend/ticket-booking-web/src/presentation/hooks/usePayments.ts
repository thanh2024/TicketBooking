import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { PaymentRepository, type CreatePaymentRequest, type PaymentCallbackRequest } from '../../infrastructure/repositories/PaymentRepository';

export function useCreatePayment() {
  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => PaymentRepository.create(data),
  });
}

export function usePaymentStatus(paymentId: string | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ['payments', paymentId],
    queryFn: () => PaymentRepository.getById(paymentId!),
    enabled: !!paymentId && enabled,
    refetchInterval: (query) => {
      // Poll every 3 seconds if status is PENDING
      const status = query.state?.data?.data?.status;
      if (status === 'PENDING') return 3000;
      return false; // Stop polling
    },
    refetchIntervalInBackground: true,
  });
}

export function useProcessPaymentCallback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentCallbackRequest) => PaymentRepository.processCallback(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
