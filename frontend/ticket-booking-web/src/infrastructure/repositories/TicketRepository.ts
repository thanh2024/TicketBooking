import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';

export interface TicketDto {
  id: string;
  orderDetailId: string;
  ticketTypeId: number;
  ticketCode: string;
  qrCode: string;
  holderName?: string;
  holderEmail?: string;
  status: string;
  checkedInAt?: string;
  eventTitle?: string;
  ticketTypeName?: string;
  createdAt: string;
}

export const TicketRepository = {
  getMyTickets: async (): Promise<ApiResponse<TicketDto[]>> => {
    return await axiosClient.get('/tickets/my-tickets') as unknown as ApiResponse<TicketDto[]>;
  },

  getById: async (id: string): Promise<ApiResponse<TicketDto>> => {
    return await axiosClient.get(`/tickets/${id}`) as unknown as ApiResponse<TicketDto>;
  },

  checkIn: async (ticketCode: string): Promise<ApiResponse<string>> => {
    return await axiosClient.post('/organizer/tickets/check-in', { ticketCode }) as unknown as ApiResponse<string>;
  },
};
