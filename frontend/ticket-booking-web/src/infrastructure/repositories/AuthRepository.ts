import { axiosClient } from '../api/axiosClient';
import type { ApiResponse } from '../../domain/value-objects/ApiResponse';
import type { LoginResponse, RegisterResponse } from '../../application/auth/AuthDTOs';
import type { User } from '../../domain/entities/User';

export const AuthRepository = {
  login: async (data: Record<string, unknown>): Promise<ApiResponse<LoginResponse>> => {
    return await axiosClient.post('/auth/login', data) as unknown as ApiResponse<LoginResponse>;
  },

  register: async (data: Record<string, unknown>): Promise<ApiResponse<RegisterResponse>> => {
    return await axiosClient.post('/auth/register', data) as unknown as ApiResponse<RegisterResponse>;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    return await axiosClient.get('/auth/me') as unknown as ApiResponse<User>;
  },

  logout: async (): Promise<ApiResponse<string>> => {
    return await axiosClient.post('/auth/logout') as unknown as ApiResponse<string>;
  },
};
