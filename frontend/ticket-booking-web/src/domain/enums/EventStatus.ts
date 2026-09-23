export const EventStatus = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  FINISHED: 'FINISHED',
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];
