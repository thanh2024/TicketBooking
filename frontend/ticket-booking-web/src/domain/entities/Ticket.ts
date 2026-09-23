import type { TicketStatus } from '../enums/TicketStatus';

export interface Ticket {
  id: string;
  orderDetailId: string;
  ticketTypeId: number;
  ticketCode: string;
  qrCode: string;
  holderName?: string;
  holderEmail?: string;
  status: TicketStatus;
  checkedInAt?: string;
  createdAt: string;
  updatedAt?: string;
}
