import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, MapPin, Tag, Image as ImageIcon, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { updateEventSchema, type UpdateEventFormData } from '../../../application/events/EventSchemas';
import { useUpdateEvent, useSubmitEvent } from '../../hooks/useOrganizer';
import { useCategories, useEventDetail } from '../../hooks/useEvents';
import { Button } from '../../../shared/components/Button';

export const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateEventMutation = useUpdateEvent();
  const submitEventMutation = useSubmitEvent();
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { data: eventData, isLoading: isEventLoading } = useEventDetail(id || '');
  const { data: categoriesData } = useCategories();

  const event = eventData?.data;
  const categories = categoriesData?.data || [];
  const isDraft = event?.status === 'DRAFT';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateEventFormData>({
    resolver: zodResolver(updateEventSchema),
  });

  // Populate form when data loads
  useEffect(() => {
    if (event) {
      // API returns datetime strings, we need to slice them for datetime-local input
      const formatForInput = (dateString: string) => {
        try {
          const d = new Date(dateString);
          return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        } catch {
          return '';
        }
      };

      reset({
        title: event.title,
        description: event.description || '',
        location: event.location,
        startTime: formatForInput(event.startTime),
        endTime: formatForInput(event.endTime),
        thumbnailUrl: event.thumbnailUrl || event.imageUrls?.[0] || '',
        categoryId: event.categoryId?.toString() || '',
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: UpdateEventFormData) => {
    if (!id) return;
    try {
      const result = await updateEventMutation.mutateAsync({ id, data });
      if (result.isSuccess) {
        navigate('/organizer/events');
      } else {
        alert(result.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sự kiện');
    }
  };

  const handleSubmitForReview = async () => {
    if (!id) return;
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn gửi sự kiện này để chờ duyệt không?\n\nSau khi gửi, sự kiện sẽ chuyển sang trạng thái "Chờ duyệt" và bạn cần chỉnh sửa thông tin trước khi gửi lại nếu cần.'
    );
    if (!confirmed) return;

    try {
      const result = await submitEventMutation.mutateAsync(id);
      if (result.isSuccess) {
        setSubmitSuccess(true);
        setTimeout(() => navigate('/organizer/events'), 2000);
      } else {
        alert(result.message || 'Có lỗi xảy ra khi gửi duyệt');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi gửi sự kiện để duyệt');
    }
  };

  if (isEventLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center text-red-500 py-10">
        Không tìm thấy sự kiện
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <CheckCircle className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900">Gửi duyệt thành công!</h2>
        <p className="text-gray-500 text-center">
          Sự kiện của bạn đã được gửi để chờ Admin duyệt.<br />
          Bạn sẽ được chuyển về trang quản lý sự kiện...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Cập nhật sự kiện</h1>
        {/* Status badge */}
        {event.status === 'DRAFT' && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
            Bản nháp
          </span>
        )}
        {event.status === 'PENDING' && (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            Chờ duyệt
          </span>
        )}
        {event.status === 'PUBLISHED' && (
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Đã xuất bản
          </span>
        )}
        {event.status === 'REJECTED' && (
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            Bị từ chối
          </span>
        )}
      </div>

      {/* DRAFT notice banner */}
      {isDraft && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">Sự kiện đang ở trạng thái Bản nháp</p>
            <p className="text-sm text-blue-600 mt-1">
              Hãy hoàn thiện thông tin sự kiện, sau đó nhấn <strong>"Gửi duyệt"</strong> để Admin xem xét và phê duyệt.
            </p>
          </div>
        </div>
      )}

      {/* REJECTED notice with reason */}
      {event.status === 'REJECTED' && (event as any).rejectionReason && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Sự kiện bị từ chối</p>
            <p className="text-sm text-red-600 mt-1">Lý do: {(event as any).rejectionReason}</p>
            <p className="text-sm text-red-500 mt-1">Hãy chỉnh sửa và gửi lại để duyệt.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center">
            <Tag className="w-5 h-5 mr-2 text-blue-500" /> Thông tin cơ bản
          </h2>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên sự kiện <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('title')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
              <select
                {...register('categoryId')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả sự kiện</label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa (URL)</label>
              <div className="flex items-center">
                <ImageIcon className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  {...register('thumbnailUrl')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Time and Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-500" /> Thời gian & Địa điểm
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu <span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="datetime-local"
                  {...register('startTime')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc <span className="text-red-500">*</span></label>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="datetime-local"
                  {...register('endTime')}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm tổ chức <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('location')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left: Submit for review (only shown for DRAFT events) */}
          <div>
            {isDraft && (
              <button
                type="button"
                onClick={handleSubmitForReview}
                disabled={submitEventMutation.isPending}
                className="flex items-center px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitEventMutation.isPending ? 'Đang gửi...' : 'Gửi duyệt'}
              </button>
            )}
          </div>

          {/* Right: Save & Cancel */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/organizer/events')}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting || updateEventMutation.isPending}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>

      </form>
    </div>
  );
};
