import type { UserRole } from '../enums/UserRole';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  roles: UserRole[];
  createdAt: string;
  updatedAt?: string;
}
