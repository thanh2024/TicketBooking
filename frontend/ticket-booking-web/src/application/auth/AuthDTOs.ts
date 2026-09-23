import type { UserRole } from '../../domain/enums/UserRole';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  userId: string;
}
