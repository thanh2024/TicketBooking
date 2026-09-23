export interface TicketType {
  id: string | number;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
  saleStartTime: string;
  saleEndTime: string;
  createdAt: string;
  updatedAt?: string;
}
