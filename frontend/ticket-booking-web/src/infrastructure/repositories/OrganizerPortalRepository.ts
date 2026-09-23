import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';

export const OrganizerPortalRepository = {
  registerOrganizer: async (data: {
    name: string;
    description?: string;
    phone: string;
    email: string;
    logoUrl?: string;
  }): Promise<ApiResponse<any>> => {
    return await axiosClient.post('/organizer/register', data) as unknown as ApiResponse<any>;
  },

  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    return await axiosClient.get('/organizer/dashboard') as unknown as ApiResponse<any>;
  },

  getRevenue: async (): Promise<ApiResponse<any>> => {
    return await axiosClient.get('/organizer/revenue') as unknown as ApiResponse<any>;
  },
  
  getMyEvents: async (): Promise<ApiResponse<any[]>> => {
    return await axiosClient.get('/organizer/events') as unknown as ApiResponse<any[]>;
  },

  getEventOrders: async (eventId: string): Promise<ApiResponse<any[]>> => {
    return await axiosClient.get(`/organizer/events/${eventId}/orders`) as unknown as ApiResponse<any[]>;
  },

  getOrganizerOrders: async (eventId?: string): Promise<ApiResponse<any[]>> => {
    const params = eventId ? { eventId } : {};
    return await axiosClient.get('/organizer/events/orders', { params }) as unknown as ApiResponse<any[]>;
  },
  
  createEvent: async (data: any): Promise<ApiResponse<any>> => {
    return await axiosClient.post('/organizer/events', data) as unknown as ApiResponse<any>;
  },

  updateEvent: async (id: string, data: any): Promise<ApiResponse<any>> => {
    return await axiosClient.put(`/organizer/events/${id}`, data) as unknown as ApiResponse<any>;
  },

  submitEvent: async (id: string): Promise<ApiResponse<any>> => {
    return await axiosClient.post(`/organizer/events/${id}/submit`) as unknown as ApiResponse<any>;
  },

  deleteEvent: async (id: string): Promise<ApiResponse<any>> => {
    return await axiosClient.delete(`/organizer/events/${id}`) as unknown as ApiResponse<any>;
  },
  
  scanTicket: async (ticketCode: string): Promise<ApiResponse<any>> => {
    return await axiosClient.post('/organizer/tickets/check-in', { ticketCode }) as unknown as ApiResponse<any>;
  },
};
