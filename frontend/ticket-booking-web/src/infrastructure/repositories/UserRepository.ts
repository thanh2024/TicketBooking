import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';
import type { User } from '../../domain/entities/User';

export const UserRepository = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    return await axiosClient.get('/users/profile') as unknown as ApiResponse<User>;
  },
  
  updateProfile: async (data: { fullName: string; avatarUrl?: string }): Promise<ApiResponse<User>> => {
    return await axiosClient.put('/users/profile', data) as unknown as ApiResponse<User>;
  }
};
