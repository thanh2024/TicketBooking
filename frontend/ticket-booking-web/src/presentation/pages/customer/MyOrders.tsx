import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyOrders, useCancelOrder } from '../../hooks/useOrders';
import { useCreatePayment } from '../../hooks/usePayments';
import { Button } from '../../../shared/components/Button';
import { Calendar, Ticket, XCircle, CreditCard } from 'lucide-react';
import { OrderStatus } from '../../../domain/enums/OrderStatus';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';

export const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { data: ordersData, isLoading } = useMyOrders();
  const cancelOrder = useCancelOrder();
  const createPayment = useCreatePayment();

  const handleCancel = (orderId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      cancelOrder.mutate(orderId);
    }
  };

  const handlePayNow = async (orderId: string) => {
    try {
      const paymentRes = await createPayment.mutateAsync({ orderId, paymentMethod: PaymentMethod.VNPAY });
      if (paymentRes.isSuccess && paymentRes.data) {
        navigate(`/payment/${paymentRes.data.id}`);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Không thể tạo thanh toán cho đơn hàng này.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case OrderStatus.PAID:
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Đã thanh toán</span>;
      case OrderStatus.PENDING:
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Chờ thanh toán</span>;
      case OrderStatus.CANCELLED:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">Đã hủy</span>;
      default:
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-2xl" />)}
      </div>
    );
  }

  const orders = ordersData?.data || [];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Lịch sử đơn hàng</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h2>
          <p className="text-gray-500 mb-6">Bạn chưa thực hiện giao dịch nào trên hệ thống.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gray-50 border-b border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 font-mono">Mã đơn: {order.id.substring(0, 8)}...</span>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
                <div className="mt-2 sm:mt-0">
                  {getStatusBadge(order.status)}
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {order.orderDetails?.map(detail => (
                    <div key={detail.id} className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">{detail.eventTitle}</h4>
                        <p className="text-sm text-gray-500">{detail.ticketTypeName} x {detail.quantity}</p>
                      </div>
                      <div className="font-medium text-gray-900">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.subTotal)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Tổng tiền</span>
                  <span className="text-xl font-bold text-blue-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </span>
                </div>
                
                {order.status === OrderStatus.PENDING && (
                  <div className="mt-6 flex justify-end space-x-4">
                    <Button
                      onClick={() => handlePayNow(order.id)}
                      isLoading={createPayment.isPending}
                    >
                      <CreditCard className="w-4 h-4 mr-2" /> Thanh toán ngay
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => handleCancel(order.id)}
                      isLoading={cancelOrder.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-2" /> Hủy đơn
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
