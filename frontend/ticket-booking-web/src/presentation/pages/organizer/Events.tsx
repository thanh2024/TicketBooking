import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useOrganizerEvents, useDeleteEvent } from '../../hooks/useOrganizer';

export const OrganizerEvents: React.FC = () => {
  const { data, isLoading, isError } = useOrganizerEvents();
  const deleteEventMutation = useDeleteEvent();
  const events = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 min-h-[50vh] flex items-center justify-center">
        Có lỗi xảy ra khi tải danh sách sự kiện.
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium flex items-center"><Clock className="w-3 h-3 mr-1"/> Bản nháp</span>;
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center"><Clock className="w-3 h-3 mr-1"/> Chờ duyệt</span>;
      case 'PUBLISHED':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Đã xuất bản</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center"><XCircle className="w-3 h-3 mr-1"/> Bị từ chối</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sự kiện "${title}" không?`)) {
      try {
        const result = await deleteEventMutation.mutateAsync(id);
        if (!result.isSuccess) {
          alert(result.message || 'Xóa sự kiện thất bại');
        }
      } catch (error: any) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi xóa sự kiện');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sự kiện</h1>
        <Link 
          to="/organizer/events/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Tạo sự kiện mới
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                <th className="p-4 font-medium">Sự kiện</th>
                <th className="p-4 font-medium">Thời gian</th>
                <th className="p-4 font-medium">Địa điểm</th>
                <th className="p-4 font-medium">Trạng thái</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    Bạn chưa có sự kiện nào. Hãy tạo sự kiện mới!
                  </td>
                </tr>
              ) : (
                events.map((event: any) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="flex items-center">
                      <div className="w-12 h-12 rounded-lg border border-gray-200 flex-shrink-0 overflow-hidden bg-gray-100 mr-4">
                          <img
                            src={event.thumbnailUrl || `https://picsum.photos/seed/${event.id}/48/48`}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const t = e.currentTarget;
                              t.onerror = null;
                              t.src = `https://picsum.photos/seed/${event.id ?? 'event'}/48/48`;
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-1">{event.title}</h3>
                          <p className="text-xs text-gray-500">{event.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{new Date(event.startTime).toLocaleDateString('vi-VN')}</p>
                      <p className="text-xs text-gray-500">{new Date(event.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900 line-clamp-1 max-w-xs">{event.location}</p>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link 
                        to={`/organizer/events/${event.id}/edit`}
                        className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(event.id, event.title)}
                        disabled={deleteEventMutation.isPending}
                        className="inline-flex items-center p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
