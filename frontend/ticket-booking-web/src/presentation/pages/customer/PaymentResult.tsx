import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowRight, ShieldCheck, AlertCircle, CreditCard } from 'lucide-react';
import { usePaymentStatus, useProcessPaymentCallback } from '../../hooks/usePayments';
import { Button } from '../../../shared/components/Button';
import { PaymentStatus } from '../../../domain/enums/PaymentStatus';

export const PaymentResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: paymentData, isLoading, error, refetch } = usePaymentStatus(id);
  const processCallback = useProcessPaymentCallback();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader className="w-16 h-16 text-blue-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang tải thông tin thanh toán</h2>
        <p className="text-gray-500 text-center max-w-md">
          Vui lòng đợi trong giây lát...
        </p>
      </div>
    );
  }

  if (error || !paymentData?.data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi truy xuất thanh toán</h2>
        <p className="text-gray-500 mb-8">Không thể kiểm tra trạng thái thanh toán. Vui lòng thử lại sau.</p>
        <Button onClick={() => navigate('/my-orders')}>Về lịch sử đơn hàng</Button>
      </div>
    );
  }

  const payment = paymentData.data;

  const handleSimulatePayment = async (isSuccess: boolean) => {
    try {
      await processCallback.mutateAsync({
        orderId: payment.orderId,
        transactionId: payment.transactionId || `TXN-${Date.now()}`,
        amount: payment.amount,
        isSuccess,
      });
      await refetch();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xử lý callback.');
    }
  };

  // State 1: PENDING -> Payment Gateway Simulator UI
  if (payment.status === PaymentStatus.PENDING) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Cổng thanh toán Sandbox</h2>
                <p className="text-xs text-blue-600 flex items-center font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Giả lập môi trường VNPay / MoMo
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase tracking-wider">
              Chờ thanh toán
            </span>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Mã giao dịch:</span>
              <span className="font-mono text-gray-800 font-semibold">{payment.transactionId || payment.id.substring(0, 8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phương thức:</span>
              <span className="font-medium text-gray-800 uppercase">{payment.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
              <span className="text-gray-700 font-medium">Số tiền thanh toán:</span>
              <span className="text-xl font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-800 mb-8 flex items-start">
            <AlertCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
            <span>
              Đây là hệ thống mô phỏng thanh toán. Hãy chọn một trong hai hành động dưới đây để kiểm thử luồng cập nhật đơn hàng và phát hành vé điện tử.
            </span>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => handleSimulatePayment(true)}
              isLoading={processCallback.isPending}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold text-base"
            >
              <CheckCircle className="w-5 h-5 mr-2" /> Xác nhận thanh toán thành công (Mô phỏng)
            </Button>
            <Button
              onClick={() => handleSimulatePayment(false)}
              isLoading={processCallback.isPending}
              variant="danger"
              className="w-full h-12 text-base font-semibold"
            >
              <XCircle className="w-5 h-5 mr-2" /> Hủy / Thất bại giao dịch (Mô phỏng)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // State 2: SUCCESS / FAILED
  const isSuccess = payment.status === PaymentStatus.SUCCESS;

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center">
        {isSuccess ? (
          <>
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Thanh toán thành công!</h1>
            <p className="text-gray-600 text-base mb-6">
              Cảm ơn bạn đã hoàn tất đặt vé. Vé điện tử kèm mã QR đã được phát hành trong tài khoản của bạn.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl max-w-md mx-auto mb-8 text-sm text-gray-600 space-y-2 text-left border border-slate-100">
              <div className="flex justify-between">
                <span>Số tiền đã trả:</span>
                <span className="font-bold text-gray-900">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Phương thức:</span>
                <span className="font-medium text-gray-800 uppercase">{payment.paymentMethod}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => navigate('/my-tickets')} className="w-full sm:w-auto text-base px-8 py-3 font-semibold">
                Xem vé điện tử của tôi
              </Button>
              <Button onClick={() => navigate('/my-orders')} variant="outline" className="w-full sm:w-auto text-base px-8 py-3">
                Xem lịch sử đơn hàng
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Thanh toán không thành công</h1>
            <p className="text-gray-600 text-base mb-8">
              Giao dịch đã bị hủy hoặc gặp sự cố trong quá trình xử lý thanh toán.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={() => navigate('/my-orders')} className="w-full sm:w-auto text-base px-8 py-3 font-semibold">
                Quay lại đơn hàng của tôi
              </Button>
              <Link to="/events" className="text-blue-600 font-medium hover:underline flex items-center">
                Tìm sự kiện khác <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
