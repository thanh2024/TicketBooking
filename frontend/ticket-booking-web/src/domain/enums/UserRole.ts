export const UserRole = {
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  CUSTOMER: 'CUSTOMER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
