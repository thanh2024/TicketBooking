import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';
import type { Payment } from '../../domain/entities/Payment';

export interface CreatePaymentRequest {
  orderId: string;
  paymentMethod: string;
}

export interface PaymentCallbackRequest {
  transactionId?: string;
  orderId: string;
  amount: number;
  isSuccess: boolean;
  signature?: string;
}

export const PaymentRepository = {
  create: async (data: CreatePaymentRequest): Promise<ApiResponse<Payment>> => {
    return await axiosClient.post('/payments/create', data) as unknown as ApiResponse<Payment>;
  },

  getById: async (id: string): Promise<ApiResponse<Payment>> => {
    return await axiosClient.get(`/payments/${id}`) as unknown as ApiResponse<Payment>;
  },

  processCallback: async (data: PaymentCallbackRequest): Promise<ApiResponse<string>> => {
    return await axiosClient.post('/payments/callback', data) as unknown as ApiResponse<string>;
  },
};
