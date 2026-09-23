import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../../domain/enums/UserRole';

interface RoleRouteProps {
  children?: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Đang tải...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole = user.roles.some((role) => allowedRoles.includes(role));

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />; // Or to a 403 Forbidden page
  }

  return children ? <>{children}</> : <Outlet />;
};
