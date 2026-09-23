import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';
import type { TicketType } from '../../domain/entities/TicketType';

export const TicketTypeRepository = {
  getByEventId: async (eventId: string): Promise<ApiResponse<TicketType[]>> => {
    return await axiosClient.get(`/events/${eventId}/ticket-types`) as unknown as ApiResponse<TicketType[]>;
  },

  create: async (eventId: string, data: Partial<TicketType>): Promise<ApiResponse<TicketType>> => {
    return await axiosClient.post(`/organizer/events/${eventId}/ticket-types`, data) as unknown as ApiResponse<TicketType>;
  },

  update: async (id: number, data: Partial<TicketType>): Promise<ApiResponse<TicketType>> => {
    return await axiosClient.put(`/organizer/ticket-types/${id}`, data) as unknown as ApiResponse<TicketType>;
  },

  delete: async (id: number): Promise<ApiResponse<string>> => {
    return await axiosClient.delete(`/organizer/ticket-types/${id}`) as unknown as ApiResponse<string>;
  },
};
