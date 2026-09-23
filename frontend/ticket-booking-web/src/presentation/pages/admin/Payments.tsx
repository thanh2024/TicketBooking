import React, { useState, useMemo } from 'react';
import { CreditCard, Search, ChevronDown, ChevronUp, Minus, CheckCircle2, XCircle, Clock, DollarSign, Hash } from 'lucide-react';
import { useAdminPayments } from '../../hooks/useAdmin';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

const formatDate = (s: string) =>
  new Date(s).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.FC<any> }> = {
  SUCCESS: { label: 'Thành công', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  FAILED: { label: 'Thất bại', color: 'bg-red-100 text-red-600', icon: XCircle },
  PENDING: { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  REFUNDED: { label: 'Đã hoàn tiền', color: 'bg-blue-100 text-blue-600', icon: DollarSign },
};

const METHOD_CONFIG: Record<string, { label: string; color: string }> = {
  VNPAY: { label: 'VNPay', color: 'bg-red-50 text-red-700' },
  MOMO: { label: 'MoMo', color: 'bg-pink-50 text-pink-700' },
  COD: { label: 'Tiền mặt', color: 'bg-gray-100 text-gray-600' },
  CASH: { label: 'Tiền mặt', color: 'bg-gray-100 text-gray-600' },
  CREDIT_CARD: { label: 'Thẻ tín dụng', color: 'bg-indigo-50 text-indigo-700' },
};

type Payment = any;
type SortField = 'createdAt' | 'amount' | 'status' | 'paymentMethod';

export const AdminPayments: React.FC = () => {
  const { data, isLoading, isError } = useAdminPayments();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const payments: Payment[] = data?.data ?? [];

  const filtered = useMemo(() => {
    return payments
      .filter(p => {
        const q = search.toLowerCase();
        const matchSearch = !q || p.transactionId?.toLowerCase().includes(q)
          || p.orderCode?.toLowerCase().includes(q);
        const matchStatus = !statusFilter || p.status === statusFilter;
        const matchMethod = !methodFilter || p.paymentMethod === methodFilter;
        return matchSearch && matchStatus && matchMethod;
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1;
        if (sortField === 'createdAt') return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        if (sortField === 'amount') return dir * (a.amount - b.amount);
        if (sortField === 'status') return dir * a.status.localeCompare(b.status);
        if (sortField === 'paymentMethod') return dir * a.paymentMethod.localeCompare(b.paymentMethod);
        return 0;
      });
  }, [payments, search, statusFilter, methodFilter, sortField, sortDir]);

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
  const successPayments = payments.filter(p => p.status === 'SUCCESS' || p.status === 'COMPLETED');
  const totalRevenue = successPayments.reduce((s: number, p: any) => s + p.amount, 0);
  const uniqueMethods = [...new Set(payments.map((p: any) => p.paymentMethod).filter(Boolean))];

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

  if (isError) return <div className="text-red-500 py-10 text-center">Không thể tải danh sách giao dịch.</div>;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <CreditCard className="w-7 h-7 mr-3 text-blue-600" /> Quản lý Giao dịch
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Tổng hợp tất cả giao dịch thanh toán trong hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Tổng giao dịch</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{payments.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Thành công</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{successPayments.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Thất bại</p>
          <p className="text-3xl font-bold text-red-500 mt-1">
            {payments.filter(p => p.status === 'FAILED').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500">Tổng thu</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalRevenue)}</p>
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
              placeholder="Tìm theo mã giao dịch, mã đơn hàng..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="SUCCESS">Thành công</option>
            <option value="COMPLETED">Hoàn thành</option>
            <option value="PENDING">Đang xử lý</option>
            <option value="FAILED">Thất bại</option>
            <option value="REFUNDED">Đã hoàn tiền</option>
          </select>
          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 bg-white"
          >
            <option value="">Tất cả phương thức</option>
            {uniqueMethods.map(m => (
              <option key={m} value={m}>{METHOD_CONFIG[m]?.label ?? m}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} / {payments.length} giao dịch</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="p-4 font-semibold">Mã giao dịch</th>
                <th className="p-4 font-semibold">Mã đơn hàng</th>
                <th
                  className="p-4 font-semibold cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort('amount')}
                >
                  <span className="flex items-center gap-1">Số tiền <SortIcon field="amount" /></span>
                </th>
                <th
                  className="p-4 font-semibold cursor-pointer hover:text-blue-600 select-none"
                  onClick={() => handleSort('paymentMethod')}
                >
                  <span className="flex items-center gap-1">Phương thức <SortIcon field="paymentMethod" /></span>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Không tìm thấy giao dịch nào</p>
                  </td>
                </tr>
              ) : filtered.map((p: Payment) => {
                const statusCfg = STATUS_CONFIG[p.status] ?? { label: p.status, color: 'bg-gray-100 text-gray-600', icon: Clock };
                const StatusIcon = statusCfg.icon;
                const methodCfg = METHOD_CONFIG[p.paymentMethod] ?? { label: p.paymentMethod, color: 'bg-gray-100 text-gray-600' };

                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-mono text-xs text-gray-600 max-w-[140px] truncate">
                          {p.transactionId || '—'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-sm font-bold text-blue-700">{p.orderCode || '—'}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900">{formatCurrency(p.amount)}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${methodCfg.color}`}>
                        {methodCfg.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className={`w-4 h-4 ${statusCfg.color.includes('green') ? 'text-green-600' : statusCfg.color.includes('red') ? 'text-red-500' : statusCfg.color.includes('yellow') ? 'text-yellow-600' : 'text-blue-500'}`} />
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusCfg.color}`}>
                          {statusCfg.label}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(p.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
