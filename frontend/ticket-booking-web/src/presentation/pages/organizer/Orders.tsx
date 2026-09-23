import React, { useState } from 'react';
import { useOrganizerOrders, useOrganizerEvents } from '../../hooks/useOrganizer';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export const OrganizerOrders: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const { data: eventsData } = useOrganizerEvents();
  const events = eventsData?.data || [];

  const { data: ordersData, isLoading, isError } = useOrganizerOrders(selectedEventId || undefined);
  const orders = ordersData?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center w-fit"><Clock className="w-3 h-3 mr-1"/> Chờ thanh toán</span>;
      case 'PAID':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center w-fit"><CheckCircle className="w-3 h-3 mr-1"/> Đã thanh toán</span>;
      case 'CANCELLED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center w-fit"><XCircle className="w-3 h-3 mr-1"/> Đã hủy</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium w-fit">{status}</span>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
        
        <div className="w-full md:w-64">
          <select 
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Tất cả sự kiện</option>
            {events.map((event: any) => (
              <option key={event.id} value={event.id}>{event.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-10">
            Có lỗi xảy ra khi tải danh sách đơn hàng.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="p-4 font-medium">Mã đơn hàng</th>
                  <th className="p-4 font-medium">Sự kiện</th>
                  <th className="p-4 font-medium">Chi tiết vé</th>
                  <th className="p-4 font-medium">Tổng tiền</th>
                  <th className="p-4 font-medium">Ngày đặt</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Chưa có đơn hàng nào.
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="p-4">
                        <span className="font-mono text-sm font-medium text-blue-600">{order.orderCode}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs line-clamp-2">
                          {order.orderDetails?.[0]?.eventTitle || 'N/A'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-sm">
                          {order.orderDetails?.map((detail: any) => (
                            <div key={detail.id} className="text-gray-600">
                              <span className="font-medium text-gray-800">{detail.quantity}x</span> {detail.ticketTypeName}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                        <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
