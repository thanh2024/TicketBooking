export const PaymentMethod = {
  VNPAY: 'VNPAY',
  MOMO: 'MOMO',
  PAYOS: 'PAYOS',
  BANKING: 'BANKING',
  CASH: 'CASH',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
