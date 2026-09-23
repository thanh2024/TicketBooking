import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { useCreateOrder } from '../../hooks/useOrders';
import { useCreatePayment } from '../../hooks/usePayments';
import { useEventDetail } from '../../hooks/useEvents';
import { Button } from '../../../shared/components/Button';
import { PaymentMethod } from '../../../domain/enums/PaymentMethod';

export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, eventId } = location.state || { items: [], eventId: '' };

  const { data: eventData } = useEventDetail(eventId);
  const createOrder = useCreateOrder();
  const createPayment = useCreatePayment();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.VNPAY);
  const [error, setError] = useState<string | null>(null);

  if (!items.length || !eventId) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-900">Giỏ hàng trống</h2>
        <Button onClick={() => navigate('/events')} className="mt-4">Quay lại danh sách sự kiện</Button>
      </div>
    );
  }

  const grandTotal = items.reduce((sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 0), 0);

  const handleCheckout = async () => {
    setError(null);
    try {
      // 1. Create Order
      const payload = {
        items: items.map((item: any) => ({
          ticketTypeId: String(item.ticketTypeId),
          quantity: Number(item.quantity),
        })),
      };

      const orderRes = await createOrder.mutateAsync(payload);
      
      if (orderRes.isSuccess && orderRes.data) {
        const orderId = orderRes.data.id;
        
        // 2. Create Payment
        const paymentRes = await createPayment.mutateAsync({ orderId, paymentMethod });
        
        if (paymentRes.isSuccess && paymentRes.data) {
          // Navigate to payment status/polling page
          navigate(`/payment/${paymentRes.data.id}`);
        } else {
          setError('Không thể khởi tạo thanh toán. Vui lòng thử lại.');
        }
      } else {
        setError(orderRes.message || 'Không thể tạo đơn hàng.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi trong quá trình xử lý.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 flex items-start rounded-r-lg">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-4">Chi tiết đơn hàng</h2>
            {eventData?.data && (
              <div className="mb-4 bg-gray-50 p-4 rounded-xl">
                <h3 className="font-bold text-gray-900 text-lg">{eventData.data.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{eventData.data.location}</p>
              </div>
            )}
            
            <div className="divide-y divide-gray-100">
              {items.map((item: any, index: number) => {
                const itemTotal = (item.price || 0) * item.quantity;
                return (
                  <div key={index} className="flex justify-between items-center py-3">
                    <div>
                      <p className="font-semibold text-gray-800">{item.ticketTypeName || `Vé #${item.ticketTypeId}`}</p>
                      <p className="text-sm text-gray-500">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price || 0)} x {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(itemTotal)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-blue-600" /> Phương thức thanh toán
            </h2>
            <div className="space-y-3">
              {[
                { id: PaymentMethod.VNPAY, label: 'VNPay (Thẻ ATM/QR Code/Banking)' },
                { id: PaymentMethod.MOMO, label: 'Ví MoMo' },
                { id: PaymentMethod.BANKING, label: 'Chuyển khoản ngân hàng trực tiếp' }
              ].map((method) => (
                <label 
                  key={method.id} 
                  className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === method.id ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 font-medium text-gray-900">{method.label}</span>
                  {paymentMethod === method.id && <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Total */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tổng cộng</h3>
            <div className="space-y-3 mb-6 border-b pb-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Tổng tiền vé</span>
                <span className="font-medium text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(grandTotal)}
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Phí dịch vụ</span>
                <span>Miễn phí</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-900 font-bold">Thành tiền</span>
              <span className="text-2xl font-extrabold text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(grandTotal)}
              </span>
            </div>
            
            <Button 
              onClick={handleCheckout} 
              isLoading={createOrder.isPending || createPayment.isPending}
              className="w-full h-12 text-lg font-semibold"
            >
              Thanh toán ngay
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">
              Bằng việc bấm Thanh toán, bạn đồng ý với Điều khoản và Dịch vụ của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
