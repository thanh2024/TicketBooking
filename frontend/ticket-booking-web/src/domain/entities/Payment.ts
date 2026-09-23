import type { PaymentMethod } from '../enums/PaymentMethod';
import type { PaymentStatus } from '../enums/PaymentStatus';

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  createdAt: string;
  updatedAt?: string;
}
