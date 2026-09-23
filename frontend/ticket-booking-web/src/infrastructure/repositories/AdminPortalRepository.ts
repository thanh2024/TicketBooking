import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';

import type { AdminUser } from '../../domain/entities/AdminUser';

export const AdminPortalRepository = {
  getDashboardStats: async (): Promise<ApiResponse<any>> => {
    return await axiosClient.get('/admin/dashboard') as unknown as ApiResponse<any>;
  },
  
  getPendingOrganizers: async (): Promise<ApiResponse<any[]>> => {
    return await axiosClient.get('/admin/organizers/pending') as unknown as ApiResponse<any[]>;
  },

  approveOrganizer: async (id: string, isApproved: boolean): Promise<ApiResponse<any>> => {
    return await axiosClient.post(`/admin/organizers/${id}/${isApproved ? 'approve' : 'reject'}`) as unknown as ApiResponse<any>;
  },
  
  getAllUsers: async (): Promise<ApiResponse<AdminUser[]>> => {
    return await axiosClient.get('/admin/users') as unknown as ApiResponse<AdminUser[]>;
  },

  lockUser: async (id: string): Promise<ApiResponse<string>> => {
    return await axiosClient.put(`/admin/users/${id}/lock`) as unknown as ApiResponse<string>;
  },

  unlockUser: async (id: string): Promise<ApiResponse<string>> => {
    return await axiosClient.put(`/admin/users/${id}/unlock`) as unknown as ApiResponse<string>;
  },

  getPendingEvents: async (): Promise<ApiResponse<any[]>> => {
    return await axiosClient.get('/admin/events/pending') as unknown as ApiResponse<any[]>;
  },

  approveEvent: async (id: string): Promise<ApiResponse<string>> => {
    return await axiosClient.post(`/admin/events/${id}/approve`) as unknown as ApiResponse<string>;
  },

  rejectEvent: async (id: string): Promise<ApiResponse<string>> => {
    return await axiosClient.post(`/admin/events/${id}/reject`) as unknown as ApiResponse<string>;
  },

  blockEvent: async (id: string): Promise<ApiResponse<string>> => {
    return await axiosClient.post(`/admin/events/${id}/block`) as unknown as ApiResponse<string>;
  },

  getOrders: async (): Promise<ApiResponse<any[]>> => {
    return await axiosClient.get('/admin/orders') as unknown as ApiResponse<any[]>;
  },

  getPayments: async (): Promise<ApiResponse<any[]>> => {
    return await axiosClient.get('/admin/payments') as unknown as ApiResponse<any[]>;
  },
};
