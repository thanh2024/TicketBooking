import React from 'react';
import { Link } from 'react-router-dom';
import { useOrganizerStats } from '../../hooks/useOrganizer';
import {
  Users, Ticket, DollarSign, Calendar, TrendingUp,
  Plus, BarChart2, ShoppingCart, CheckCircle, Clock, XCircle, FileText
} from 'lucide-react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return d.toLocaleDateString('vi-VN');
};

const getOrderStatusConfig = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PAID': return { label: 'Đã thanh toán', color: 'text-green-600 bg-green-50', icon: CheckCircle };
    case 'PENDING': return { label: 'Chờ thanh toán', color: 'text-yellow-600 bg-yellow-50', icon: Clock };
    case 'CANCELLED': return { label: 'Đã huỷ', color: 'text-red-500 bg-red-50', icon: XCircle };
    default: return { label: status, color: 'text-gray-600 bg-gray-50', icon: Clock };
  }
};

export const OrganizerDashboard: React.FC = () => {
  const { data: statsData, isLoading, isError } = useOrganizerStats();

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 bg-gray-200 rounded-2xl" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        Không thể tải dữ liệu dashboard. Vui lòng thử lại.
      </div>
    );
  }

  const stats = statsData?.data;

  const kpiCards = [
    {
      name: 'Tổng doanh thu',
      value: formatCurrency(stats?.totalRevenue ?? 0),
      subValue: `Tháng này: ${formatCurrency(stats?.monthlyRevenue ?? 0)}`,
      icon: DollarSign,
      gradient: 'from-emerald-500 to-teal-600',
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      name: 'Vé đã bán',
      value: (stats?.soldTickets ?? 0).toLocaleString('vi-VN'),
      subValue: `Còn lại: ${(stats?.availableTickets ?? 0).toLocaleString('vi-VN')} vé`,
      icon: Ticket,
      gradient: 'from-blue-500 to-indigo-600',
      bg: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      name: 'Tổng sự kiện',
      value: (stats?.totalEvents ?? 0).toString(),
      subValue: `${stats?.activeEvents ?? 0} đang mở · ${stats?.pendingEvents ?? 0} chờ duyệt`,
      icon: Calendar,
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50',
      textColor: 'text-violet-700',
    },
    {
      name: 'Đơn hàng',
      value: (stats?.totalOrders ?? 0).toLocaleString('vi-VN'),
      subValue: `${stats?.totalAttendees ?? 0} người tham dự`,
      icon: Users,
      gradient: 'from-orange-500 to-rose-500',
      bg: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  const recentOrders: any[] = stats?.recentOrders ?? [];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan Ban Tổ Chức</h1>
          <p className="text-sm text-gray-500 mt-0.5">Theo dõi hiệu suất sự kiện của bạn</p>
        </div>
        <Link
          to="/organizer/events/create"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-sm text-sm"
        >
          <Plus className="w-4 h-4 mr-2" /> Tạo sự kiện mới
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.textColor}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">{card.name}</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1 leading-tight">{card.value}</h3>
            <p className="text-xs text-gray-400 mt-1">{card.subValue}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Status breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" /> Trạng thái sự kiện
          </h2>

          <div className="space-y-4">
            {[
              { label: 'Đang mở', count: stats?.activeEvents ?? 0, color: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-100' },
              { label: 'Chờ duyệt', count: stats?.pendingEvents ?? 0, color: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-100' },
              { label: 'Nháp', count: stats?.draftEvents ?? 0, color: 'bg-gray-400', text: 'text-gray-600', bg: 'bg-gray-100' },
            ].map((item) => {
              const total = Math.max(stats?.totalEvents ?? 0, 1);
              const pct = Math.round((item.count / total) * 100);
              return (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-gray-600">{item.label}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.text} ${item.bg}`}>
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ticket sold rate */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-2">Tỷ lệ bán vé</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-100 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      stats?.totalTickets
                        ? Math.round(((stats?.soldTickets ?? 0) / stats.totalTickets) * 100)
                        : 0,
                      100
                    )}%`
                  }}
                />
              </div>
              <span className="text-sm font-bold text-gray-700">
                {stats?.totalTickets
                  ? Math.round(((stats?.soldTickets ?? 0) / stats.totalTickets) * 100)
                  : 0}%
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {(stats?.soldTickets ?? 0).toLocaleString('vi-VN')} / {(stats?.totalTickets ?? 0).toLocaleString('vi-VN')} vé
            </p>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-blue-500" /> Giao dịch gần đây
            </h2>
            <Link
              to="/organizer/orders"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <FileText className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">Chưa có đơn hàng nào</p>
              <Link
                to="/organizer/events/create"
                className="mt-3 text-sm text-blue-500 hover:underline"
              >
                Tạo sự kiện đầu tiên của bạn
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order: any) => {
                const statusCfg = getOrderStatusConfig(order.status);
                const StatusIcon = statusCfg.icon;
                return (
                  <div
                    key={order.orderId}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 ${statusCfg.color}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {order.eventTitle || 'Sự kiện'}
                        {order.ticketTypeName ? ` · ${order.ticketTypeName}` : ''}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{order.orderCode}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{order.quantity} vé</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { to: '/organizer/events', label: 'Quản lý sự kiện', icon: Calendar, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
          { to: '/organizer/orders', label: 'Xem đơn hàng', icon: ShoppingCart, color: 'text-violet-600 bg-violet-50 hover:bg-violet-100' },
          { to: '/organizer/revenue', label: 'Báo cáo doanh thu', icon: TrendingUp, color: 'text-green-600 bg-green-50 hover:bg-green-100' },
          { to: '/organizer/check-in', label: 'Soát vé', icon: Ticket, color: 'text-orange-600 bg-orange-50 hover:bg-orange-100' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`${item.color} rounded-2xl p-4 flex flex-col items-center gap-2 text-center transition-colors`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-sm font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
