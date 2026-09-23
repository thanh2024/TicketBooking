export const TicketStatus = {
  VALID: 'VALID',
  USED: 'USED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
} as const;

export type TicketStatus = (typeof TicketStatus)[keyof typeof TicketStatus];
