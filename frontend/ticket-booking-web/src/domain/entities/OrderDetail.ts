import type { TicketType } from './TicketType';

export interface OrderDetail {
  id: string;
  orderId: string;
  ticketTypeId: number;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  ticketType?: TicketType;
}
