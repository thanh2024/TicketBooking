import React, { useState, useMemo } from 'react';
import { ShoppingCart, Search, ChevronDown, ChevronUp, Minus, User, Ticket } from 'lucide-react';
import { useAdminOrders } from '../../hooks/useAdmin';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const formatDate = (s: string) =>
  new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PAID: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-700' },
  PENDING: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-700' },
  CANCELLED: { label: 'Đã huỷ', color: 'bg-red-100 text-red-600' },
};

type Order = any;
type SortField = 'createdAt' | 'totalAmount' | 'status';

export const AdminOrders: React.FC = () => {
  const { data, isLoading, isError } = useAdminOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const orders: Order[] = data?.data ?? [];

  const filtered = useMemo(() => {
    return orders
      .filter(o => {
        const q = search.toLowerCase();
        const matchSearch = !q || o.orderCode?.toLowerCase().includes(q)
          || o.userName?.toLowerCase().includes(q)
          || o.userEmail?.toLowerCase().includes(q)
          || o.orderDetails?.some((d: any) => d.eventTitle?.toLowerCase().includes(q));
        const matchStatus = !statusFilter || o.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1;
        if (sortField === 'createdAt') return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        if (sortField === 'totalAmount') return dir * (a.totalAmount - b.totalAmount);
        if (sortField === 'status') return dir * a.status.localeCompare(b.status);
        return 0;
      });
  }, [orders, search, statusFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <Minus className="w-3 h-3 text-gray-300" />;
    return sortDir === 'desc'
      ? <ChevronDown className="w-3 h-3 text-blue-500" />
      : <ChevronUp className="w-3 h-3 text-blue-500" />;
  };

  // Summary stats
  const totalRevenue = orders.filter(o => o.status === 'PAID').reduce((s: number, o: any) => s + o.totalAmount, 0);
  const paidCount = orders.filter(o => o.status === 'PAID').length;
  const pendingCount = orders.filter(o => o.status === 'PENDING').length;

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
        </div>
        <div className="h-96 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  if (isError) return <div className="text-red-500 py-10 text-center">Không thể tải danh sách đơn hàng.</div>;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <ShoppingCart className="w-7 h-7 mr-3 text-blue-600" /> Quản lý Đơn hàng
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Tổng hợp tất cả đơn đặt vé trong hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Tổng đơn hàng</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length.toLocaleString('vi-VN')}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Đã thanh toán</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{paidCount}</p>
          <p className="text-xs text-gray-400 mt-1">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Chờ thanh toán</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">{pendingCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo mã đơn, khách hàng, email, sự kiện..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="PENDING">Chờ thanh toán</option>
            <option value="CANCELLED">Đã huỷ</option>
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} / {orders.length} đơn hàng</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="p-4 font-semibold">Mã đơn</th>
                <th className="p-4 font-semibold">Khách hàng</th>
                <th className="p-4 font-semibold">Sự kiện</th>
                <th
                  className="p-4 font-semibold cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort('totalAmount')}
                >
                  <span className="flex items-center gap-1">Tổng tiền <SortIcon field="totalAmount" /></span>
                </th>
                <th
                  className="p-4 font-semibold cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort('status')}
                >
                  <span className="flex items-center gap-1">Trạng thái <SortIcon field="status" /></span>
                </th>
                <th
                  className="p-4 font-semibold cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort('createdAt')}
                >
                  <span className="flex items-center gap-1">Thời gian <SortIcon field="createdAt" /></span>
                </th>
                <th className="p-4 font-semibold">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Không tìm thấy đơn hàng nào</p>
                  </td>
                </tr>
              ) : filtered.map((order: Order) => {
                const statusCfg = STATUS_CONFIG[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' };
                const isExpanded = expandedId === order.id;
                const firstEvent = order.orderDetails?.[0]?.eventTitle ?? '—';
                const detailCount = order.orderDetails?.length ?? 0;

                return (
                  <React.Fragment key={order.id}>
                    <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-blue-50/40' : ''}`}>
                      <td className="p-4">
                        <span className="font-mono text-sm font-bold text-blue-700">{order.orderCode}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-2">
                          <div className="p-1.5 bg-gray-100 rounded-lg flex-shrink-0">
                            <User className="w-3.5 h-3.5 text-gray-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{order.userName || '—'}</p>
                            <p className="text-xs text-gray-400">{order.userEmail || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-700 max-w-[180px] truncate">{firstEvent}</p>
                        {detailCount > 1 && (
                          <p className="text-xs text-gray-400">+{detailCount - 1} sự kiện khác</p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : order.id)}
                          className="text-blue-500 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
                        >
                          {isExpanded ? <><ChevronUp className="w-3.5 h-3.5" />Đóng</> : <><ChevronDown className="w-3.5 h-3.5" />Xem</>}
                        </button>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="bg-blue-50/50 px-6 py-4 border-t border-blue-100">
                          <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-3">Chi tiết đơn hàng</p>
                            {order.orderDetails?.map((d: any) => (
                              <div key={d.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-blue-100">
                                <div className="p-1.5 bg-blue-50 rounded-lg">
                                  <Ticket className="w-4 h-4 text-blue-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 truncate">{d.eventTitle}</p>
                                  <p className="text-xs text-gray-500">{d.ticketTypeName}</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm font-bold text-gray-800">{formatCurrency(d.subTotal)}</p>
                                  <p className="text-xs text-gray-400">{d.quantity} × {formatCurrency(d.unitPrice)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
