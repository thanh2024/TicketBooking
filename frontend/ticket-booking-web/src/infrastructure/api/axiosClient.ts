import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../storage/tokenStorage';
import { useAuthStore } from '../../app/store/authStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5287/api';

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = tokenStorage.getRefreshToken();
      const accessToken = tokenStorage.getAccessToken();

      if (refreshToken && accessToken) {
        try {
          const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
            accessToken,
            refreshToken,
          });

          if (response.data.isSuccess) {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
            tokenStorage.setAccessToken(newAccessToken);
            tokenStorage.setRefreshToken(newRefreshToken);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return axiosClient(originalRequest);
          }
        } catch {
          tokenStorage.clearTokens();
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } else {
        tokenStorage.clearTokens();
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
