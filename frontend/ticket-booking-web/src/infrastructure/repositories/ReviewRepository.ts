import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';

export interface ReviewDto {
  id: string;
  userId: string;
  eventId: string;
  userFullName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface CreateReviewRequest {
  rating: number;
  comment?: string;
}

export const ReviewRepository = {
  getByEventId: async (eventId: string): Promise<ApiResponse<ReviewDto[]>> => {
    return await axiosClient.get(`/events/${eventId}/reviews`) as unknown as ApiResponse<ReviewDto[]>;
  },

  create: async (eventId: string, data: CreateReviewRequest): Promise<ApiResponse<ReviewDto>> => {
    return await axiosClient.post(`/events/${eventId}/reviews`, data) as unknown as ApiResponse<ReviewDto>;
  },

  update: async (id: string, data: CreateReviewRequest): Promise<ApiResponse<ReviewDto>> => {
    return await axiosClient.put(`/reviews/${id}`, data) as unknown as ApiResponse<ReviewDto>;
  },

  delete: async (id: string): Promise<ApiResponse<string>> => {
    return await axiosClient.delete(`/reviews/${id}`) as unknown as ApiResponse<string>;
  },
};
