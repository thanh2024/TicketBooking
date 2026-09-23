export const OrganizerStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  BLOCKED: 'BLOCKED',
} as const;

export type OrganizerStatus = (typeof OrganizerStatus)[keyof typeof OrganizerStatus];
