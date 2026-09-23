import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Search, 
  Ban, 
  Filter, 
  AlertTriangle 
} from 'lucide-react';
import { usePendingEvents, useApproveEvent, useRejectEvent, useBlockEvent } from '../../hooks/useAdmin';
import { useEvents } from '../../hooks/useEvents';
import { Button } from '../../../shared/components/Button';

export const AdminEvents: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ALL'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: pendingEventsData, isLoading: isPendingLoading } = usePendingEvents();
  const { data: allEventsData, isLoading: isAllLoading } = useEvents({ page: 1, pageSize: 50 });

  const approveEvent = useApproveEvent();
  const rejectEvent = useRejectEvent();
  const blockEvent = useBlockEvent();

  const [selectedEvent, setSelectedEvent] = useState<{ id: string; title: string } | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'BLOCK' | null>(null);

  const pendingEvents = pendingEventsData?.data || [];
  const allEvents = allEventsData?.data?.items || [];

  const displayEvents = activeTab === 'PENDING' ? pendingEvents : allEvents;

  const filteredEvents = displayEvents.filter((ev: any) =>
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ev.location && ev.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleConfirmAction = async () => {
    if (!selectedEvent || !actionType) return;

    try {
      if (actionType === 'APPROVE') {
        await approveEvent.mutateAsync(selectedEvent.id);
      } else if (actionType === 'REJECT') {
        await rejectEvent.mutateAsync(selectedEvent.id);
      } else if (actionType === 'BLOCK') {
        await blockEvent.mutateAsync(selectedEvent.id);
      }
      setSelectedEvent(null);
      setActionType(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái sự kiện.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PUBLISHED':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" /> Đã duyệt (Công khai)
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold flex items-center w-fit">
            <Clock className="w-3.5 h-3.5 mr-1 text-yellow-600" /> Chờ duyệt
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold flex items-center w-fit">
            <XCircle className="w-3.5 h-3.5 mr-1 text-red-600" /> Từ chối
          </span>
        );
      case 'CANCELLED':
      case 'BLOCKED':
        return (
          <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-bold flex items-center w-fit">
            <Ban className="w-3.5 h-3.5 mr-1 text-gray-600" /> Đã khóa / Hủy
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold w-fit">
            {status}
          </span>
        );
    }
  };

  const isLoading = activeTab === 'PENDING' ? isPendingLoading : isAllLoading;

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-blue-600" /> Duyệt & Kiểm Duyệt Sự Kiện
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Phê duyệt sự kiện mới từ các Ban tổ chức trước khi xuất bản lên trang chủ hệ thống.
          </p>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1.5 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'PENDING'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Chờ duyệt ({pendingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('ALL')}
            className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Tất cả sự kiện
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên sự kiện, địa điểm..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">Không có sự kiện nào</h3>
            <p className="text-gray-500 text-sm mt-1">
              {activeTab === 'PENDING'
                ? 'Hiện không có sự kiện nào đang chờ phê duyệt.'
                : 'Không tìm thấy sự kiện khớp với từ khóa của bạn.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredEvents.map((ev: any) => (
              <div
                key={ev.id}
                className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/60 transition-colors"
              >
                {/* Event Info */}
                <div className="flex gap-4 items-start md:items-center">
                  <div className="w-20 h-20 rounded-2xl border border-gray-200 shadow-sm flex-shrink-0 overflow-hidden bg-gray-100">
                    <img
                      src={
                        ev.thumbnailUrl ||
                        `https://picsum.photos/seed/${ev.id}/80/80`
                      }
                      alt={ev.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = `https://picsum.photos/seed/${ev.id ?? 'event'}/80/80`;
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-bold text-gray-900 leading-snug">{ev.title}</h4>
                      {getStatusBadge(ev.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      {ev.organizerName && (
                        <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          BTC: {ev.organizerName}
                        </span>
                      )}
                      {ev.location && (
                        <div className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          <span>{ev.location}</span>
                        </div>
                      )}
                      {ev.startTime && (
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          <span>{new Date(ev.startTime).toLocaleString('vi-VN')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  {ev.status?.toUpperCase() === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => {
                          setSelectedEvent(ev);
                          setActionType('APPROVE');
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-4 py-2"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> Duyệt bài
                      </Button>

                      <Button
                        variant="danger"
                        onClick={() => {
                          setSelectedEvent(ev);
                          setActionType('REJECT');
                        }}
                        className="font-semibold text-sm px-4 py-2"
                      >
                        <XCircle className="w-4 h-4 mr-1.5" /> Từ chối
                      </Button>
                    </>
                  )}

                  {ev.status?.toUpperCase() === 'PUBLISHED' && (
                    <Button
                      variant="danger"
                      onClick={() => {
                        setSelectedEvent(ev);
                        setActionType('BLOCK');
                      }}
                      className="font-semibold text-sm px-4 py-2"
                    >
                      <Ban className="w-4 h-4 mr-1.5" /> Khóa sự kiện
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedEvent && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                actionType === 'APPROVE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {actionType === 'APPROVE' ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : actionType === 'BLOCK' ? (
                <Ban className="w-8 h-8" />
              ) : (
                <AlertTriangle className="w-8 h-8" />
              )}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {actionType === 'APPROVE'
                ? 'Duyệt công khai sự kiện?'
                : actionType === 'BLOCK'
                ? 'Khóa/Hủy sự kiện này?'
                : 'Từ chối duyệt sự kiện?'}
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              Bạn có chắc chắn muốn {actionType === 'APPROVE' ? 'duyệt công khai' : actionType === 'BLOCK' ? 'khóa' : 'từ chối'} sự kiện{' '}
              <strong className="text-gray-900">{selectedEvent.title}</strong> không?
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedEvent(null);
                  setActionType(null);
                }}
                className="flex-1"
              >
                Hủy bỏ
              </Button>
              <Button
                variant={actionType === 'APPROVE' ? 'primary' : 'danger'}
                onClick={handleConfirmAction}
                isLoading={approveEvent.isPending || rejectEvent.isPending || blockEvent.isPending}
                className={`flex-1 ${actionType === 'APPROVE' ? 'bg-green-600 hover:bg-green-700 border-none' : ''}`}
              >
                {actionType === 'APPROVE' ? 'Xác nhận Duyệt' : actionType === 'BLOCK' ? 'Khoá sự kiện' : 'Từ chối'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
