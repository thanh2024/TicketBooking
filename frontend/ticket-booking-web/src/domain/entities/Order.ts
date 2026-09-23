import type { OrderStatus } from '../enums/OrderStatus';
import type { OrderDetail } from './OrderDetail';
import type { Payment } from './Payment';

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  orderDetails?: OrderDetail[];
  payments?: Payment[];
}
