import type { OrganizerStatus } from '../enums/OrganizerStatus';

export interface Organizer {
  id: string;
  userId: string;
  name: string;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  status: OrganizerStatus;
  createdAt: string;
  updatedAt?: string;
}
