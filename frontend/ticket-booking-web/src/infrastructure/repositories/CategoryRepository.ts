import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';
import type { Category } from '../../domain/entities/Category';

export const CategoryRepository = {
  getAll: async (): Promise<ApiResponse<Category[]>> => {
    return await axiosClient.get('/categories') as unknown as ApiResponse<Category[]>;
  },

  getById: async (id: number): Promise<ApiResponse<Category>> => {
    return await axiosClient.get(`/categories/${id}`) as unknown as ApiResponse<Category>;
  },
};
