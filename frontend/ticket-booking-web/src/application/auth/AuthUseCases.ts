import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import { useAuthStore } from '../../app/store/authStore';
import { jwtDecode } from 'jwt-decode';
import type { UserRole } from '../../domain/enums/UserRole';

interface JwtPayload {
  sub: string;
  email: string;
  FullName: string;
  role: string | string[];
  exp: number;
}

export const LoginUseCase = async (data: any) => {
  const response = await AuthRepository.login(data);
  if (response.isSuccess && response.data) {
    const { accessToken, refreshToken } = response.data;
    
    // Decode token to get user info
    const decoded = jwtDecode<JwtPayload>(accessToken);
    
    // Normalize roles to array
    let roles: UserRole[] = [];
    if (Array.isArray(decoded.role)) {
      roles = decoded.role as UserRole[];
    } else if (decoded.role) {
      roles = [decoded.role as UserRole];
    } else {
      // Check for Microsoft standard role claim
      const msRoleClaim = (decoded as any)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      if (Array.isArray(msRoleClaim)) {
        roles = msRoleClaim as UserRole[];
      } else if (msRoleClaim) {
        roles = [msRoleClaim as UserRole];
      }
    }

    useAuthStore.getState().setAuth(
      {
        id: decoded.sub,
        fullName: decoded.FullName || 'User',
        email: decoded.email || (decoded as any)['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        roles: roles,
        createdAt: new Date().toISOString(),
      },
      accessToken,
      refreshToken
    );
  }
  return response;
};

export const RegisterUseCase = async (data: any) => {
  return await AuthRepository.register(data);
};

export const GetMeUseCase = async () => {
  try {
    const response = await AuthRepository.getMe();
    if (response.isSuccess && response.data) {
      useAuthStore.getState().setUser(response.data);
    } else {
      useAuthStore.getState().logout();
    }
  } catch (error) {
    useAuthStore.getState().logout();
  }
};

export const LogoutUseCase = async () => {
  try {
    // Attempt to notify backend to invalidate refresh token
    const token = useAuthStore.getState().user;
    if (token) {
      await AuthRepository.logout();
    }
  } catch (error) {
    console.error('Logout API failed, continuing with local logout', error);
  } finally {
    // Always clear local state
    useAuthStore.getState().logout();
    window.location.href = '/login';
  }
};
