import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { usePendingOrganizers, useApproveOrganizer } from '../../hooks/useAdmin';
import { Button } from '../../../shared/components/Button';

export const AdminOrganizers: React.FC = () => {
  const { data: organizersData, isLoading } = usePendingOrganizers();
  const approveOrganizer = useApproveOrganizer();

  const [selectedOrganizer, setSelectedOrganizer] = useState<{ id: string; name: string; email: string } | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);

  const pendingOrganizers = organizersData?.data || [];

  const handleConfirmAction = async () => {
    if (!selectedOrganizer || !actionType) return;

    try {
      await approveOrganizer.mutateAsync({
        id: selectedOrganizer.id,
        isApproved: actionType === 'APPROVE',
      });
      setSelectedOrganizer(null);
      setActionType(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi xử lý yêu cầu.');
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Building2 className="w-8 h-8 mr-3 text-blue-600" /> Duyệt Ban Tổ Chức
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Phê duyệt các yêu cầu đăng ký tài khoản Ban tổ chức để cấp quyền đăng tải sự kiện.
          </p>
        </div>
      </div>

      {/* Overview Stat Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold">Chờ phê duyệt</span>
            <h2 className="text-3xl font-extrabold">{pendingOrganizers.length} đơn vị</h2>
          </div>
        </div>
        <p className="text-xs text-blue-100 max-w-sm">
          Các đơn vị được chấp nhận sẽ được hệ thống tự động nâng cấp vai trò Ban tổ chức (ORGANIZER) để tạo và quản lý sự kiện.
        </p>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-blue-600" /> Danh sách yêu cầu chờ duyệt
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            {pendingOrganizers.length} Yêu cầu
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : pendingOrganizers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Không có yêu cầu nào chờ duyệt</h3>
            <p className="text-gray-500 text-sm mt-1">Tất cả đơn vị đăng ký làm Ban tổ chức đã được xử lý xong.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingOrganizers.map((org: any) => (
              <div
                key={org.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/60 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-lg font-bold text-gray-900">{org.name || 'Tên Ban Tổ Chức'}</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                      CHỜ DUYỆT
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-1 text-gray-400" />
                      <span>{org.email}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Ngày đăng ký: {org.createdAt ? new Date(org.createdAt).toLocaleDateString('vi-VN') : '—'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <Button
                    onClick={() => {
                      setSelectedOrganizer(org);
                      setActionType('APPROVE');
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Chấp nhận
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => {
                      setSelectedOrganizer(org);
                      setActionType('REJECT');
                    }}
                    className="font-semibold text-sm px-5 py-2.5"
                  >
                    <XCircle className="w-4 h-4 mr-1.5" /> Từ chối
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedOrganizer && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                actionType === 'APPROVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {actionType === 'APPROVE' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {actionType === 'APPROVE' ? 'Xác nhận Chấp nhận Ban tổ chức?' : 'Xác nhận Từ chối yêu cầu?'}
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              Bạn có chắc chắn muốn {actionType === 'APPROVE' ? 'chấp nhận' : 'từ chối'} đơn vị{' '}
              <strong className="text-gray-900">{selectedOrganizer.name}</strong> ({selectedOrganizer.email}) không?
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedOrganizer(null);
                  setActionType(null);
                }}
                className="flex-1"
              >
                Hủy bỏ
              </Button>
              <Button
                variant={actionType === 'APPROVE' ? 'primary' : 'danger'}
                onClick={handleConfirmAction}
                isLoading={approveOrganizer.isPending}
                className={`flex-1 ${actionType === 'APPROVE' ? 'bg-green-600 hover:bg-green-700 border-none' : ''}`}
              >
                {actionType === 'APPROVE' ? 'Duyệt Chấp nhận' : 'Từ chối'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
