export interface Review {
  id: string;
  userId: string;
  eventId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
}
