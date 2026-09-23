import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';
import type { Pagination } from '../../domain/value-objects/Pagination';

export interface EventListDto {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  status: string;
  categoryId?: string;
  categoryName?: string;
  organizerName?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  minPrice: number;
}

export interface EventDetailDto {
  id: string;
  organizerId?: string;
  categoryId?: string;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  status: string;
  organizerName?: string;
  categoryName?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface EventFilterParams {
  search?: string;
  categoryId?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export const EventRepository = {
  getEvents: async (params: EventFilterParams): Promise<ApiResponse<Pagination<EventListDto>>> => {
    return await axiosClient.get('/events', { params }) as unknown as ApiResponse<Pagination<EventListDto>>;
  },

  getEventById: async (id: string): Promise<ApiResponse<EventDetailDto>> => {
    return await axiosClient.get(`/events/${id}`) as unknown as ApiResponse<EventDetailDto>;
  },

  getFeaturedEvents: async (count = 5): Promise<ApiResponse<EventListDto[]>> => {
    return await axiosClient.get('/events/featured', { params: { count } }) as unknown as ApiResponse<EventListDto[]>;
  },

  getUpcomingEvents: async (count = 5): Promise<ApiResponse<EventListDto[]>> => {
    return await axiosClient.get('/events/upcoming', { params: { count } }) as unknown as ApiResponse<EventListDto[]>;
  },
};
