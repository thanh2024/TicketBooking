import React, { useState } from 'react';
import {
  TrendingUp, DollarSign, ShoppingCart, Ticket,
  Calendar, BarChart2, ChevronUp, ChevronDown, Minus
} from 'lucide-react';
import { useOrganizerRevenue } from '../../hooks/useOrganizer';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

export const OrganizerRevenue: React.FC = () => {
  const { data, isLoading, isError } = useOrganizerRevenue();
  const [sortField, setSortField] = useState<'revenue' | 'ticketsSold' | 'totalOrders'>('revenue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const revenue = data?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError || !revenue) {
    return (
      <div className="text-center text-red-500 py-20">
        Có lỗi khi tải dữ liệu doanh thu.
      </div>
    );
  }

  // Sort event revenues
  const sortedEvents = [...(revenue.eventRevenues || [])].sort((a: any, b: any) => {
    const mult = sortDir === 'desc' ? -1 : 1;
    return (a[sortField] - b[sortField]) * mult;
  });

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <Minus className="w-3 h-3 text-gray-300" />;
    return sortDir === 'desc'
      ? <ChevronDown className="w-3 h-3 text-blue-500" />
      : <ChevronUp className="w-3 h-3 text-blue-500" />;
  };

  // Bar chart max
  const maxRevenue = Math.max(...(revenue.monthlyBreakdown || []).map((m: any) => m.revenue), 1);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PUBLISHED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'DRAFT': return 'bg-gray-100 text-gray-600';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      case 'CANCELLED': return 'bg-gray-200 text-gray-500';
      default: return 'bg-gray-100 text-gray-600';
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PUBLISHED': return 'Đang mở';
      case 'PENDING': return 'Chờ duyệt';
      case 'DRAFT': return 'Nháp';
      case 'REJECTED': return 'Từ chối';
      case 'CANCELLED': return 'Đã huỷ';
      default: return status;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="w-7 h-7 mr-3 text-blue-600" /> Báo cáo Doanh thu
        </h1>
        <p className="text-gray-500 text-sm mt-1">Tổng hợp doanh thu từ các sự kiện của bạn</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Tổng cộng</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue.totalRevenue)}</p>
          <p className="text-sm text-gray-500 mt-1">Tổng doanh thu</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Tháng này</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenue.monthlyRevenue)}</p>
          <p className="text-sm text-gray-500 mt-1">Doanh thu tháng hiện tại</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-violet-50 rounded-xl">
              <ShoppingCart className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Đơn hàng</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{revenue.totalOrders.toLocaleString('vi-VN')}</p>
          <p className="text-sm text-gray-500 mt-1">Đơn hàng đã thanh toán</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-orange-50 rounded-xl">
              <Ticket className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Vé</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{revenue.totalTicketsSold.toLocaleString('vi-VN')}</p>
          <p className="text-sm text-gray-500 mt-1">Vé đã bán</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-blue-500" /> Doanh thu 6 tháng gần nhất
        </h2>
        {revenue.monthlyBreakdown?.length > 0 ? (
          <div className="flex items-end justify-between gap-3 h-48">
            {revenue.monthlyBreakdown.map((m: any) => {
              const pct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={`${m.year}-${m.month}`} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                    {formatCurrency(m.revenue)}
                  </span>
                  <div className="w-full flex flex-col justify-end" style={{ height: '120px' }}>
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500 relative group cursor-default"
                      style={{ height: `${Math.max(pct, 2)}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {m.orderCount} đơn hàng
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{m.monthLabel}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <BarChart2 className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">Chưa có dữ liệu doanh thu</p>
          </div>
        )}
      </div>

      {/* Events Revenue Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" /> Doanh thu theo sự kiện
          </h2>
        </div>

        {sortedEvents.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <DollarSign className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Chưa có đơn hàng nào được thanh toán</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="p-4 font-semibold">Sự kiện</th>
                  <th className="p-4 font-semibold">Ngày</th>
                  <th className="p-4 font-semibold">Trạng thái</th>
                  <th
                    className="p-4 font-semibold cursor-pointer hover:text-blue-600 select-none"
                    onClick={() => handleSort('revenue')}
                  >
                    <span className="flex items-center gap-1">
                      Doanh thu <SortIcon field="revenue" />
                    </span>
                  </th>
                  <th
                    className="p-4 font-semibold cursor-pointer hover:text-blue-600 select-none"
                    onClick={() => handleSort('ticketsSold')}
                  >
                    <span className="flex items-center gap-1">
                      Vé bán được <SortIcon field="ticketsSold" />
                    </span>
                  </th>
                  <th
                    className="p-4 font-semibold cursor-pointer hover:text-blue-600 select-none"
                    onClick={() => handleSort('totalOrders')}
                  >
                    <span className="flex items-center gap-1">
                      Đơn hàng <SortIcon field="totalOrders" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sortedEvents.map((ev: any) => (
                  <tr key={ev.eventId} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {ev.thumbnailUrl ? (
                            <img
                              src={ev.thumbnailUrl}
                              alt={ev.eventTitle}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const t = e.currentTarget;
                                t.onerror = null;
                                t.src = `https://picsum.photos/seed/${ev.eventId}/40/40`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-blue-400" />
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900 text-sm line-clamp-2 max-w-xs">
                          {ev.eventTitle}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(ev.startTime)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(ev.status)}`}>
                        {getStatusLabel(ev.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900 text-sm">
                        {formatCurrency(ev.revenue)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700 font-medium">
                      {ev.ticketsSold.toLocaleString('vi-VN')}
                    </td>
                    <td className="p-4 text-sm text-gray-700 font-medium">
                      {ev.totalOrders}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
