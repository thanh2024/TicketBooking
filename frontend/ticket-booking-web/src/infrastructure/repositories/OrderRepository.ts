import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';

export interface CreateOrderRequest {
  items: {
    ticketTypeId: string;
    quantity: number;
  }[];
}

export interface OrderDto {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  orderDetails?: OrderDetailDto[];
}

export interface OrderDetailDto {
  id: string;
  orderId: string;
  ticketTypeId: string;
  ticketTypeName?: string;
  eventTitle?: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export const OrderRepository = {
  create: async (data: CreateOrderRequest): Promise<ApiResponse<OrderDto>> => {
    return await axiosClient.post('/orders', data) as unknown as ApiResponse<OrderDto>;
  },

  getById: async (id: string): Promise<ApiResponse<OrderDto>> => {
    return await axiosClient.get(`/orders/${id}`) as unknown as ApiResponse<OrderDto>;
  },

  getMyOrders: async (): Promise<ApiResponse<OrderDto[]>> => {
    return await axiosClient.get('/orders/my-orders') as unknown as ApiResponse<OrderDto[]>;
  },

  cancel: async (id: string): Promise<ApiResponse<string>> => {
    return await axiosClient.post(`/orders/${id}/cancel`) as unknown as ApiResponse<string>;
  },
};
