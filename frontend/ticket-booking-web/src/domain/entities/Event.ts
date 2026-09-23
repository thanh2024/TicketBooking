import type { EventStatus } from '../enums/EventStatus';
import type { Category } from './Category';
import type { Organizer } from './Organizer';

export interface Event {
  id: string;
  organizerId: string;
  categoryId: number;
  title: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  createdAt: string;
  updatedAt?: string;
  category?: Category;
  organizer?: Organizer;
}
