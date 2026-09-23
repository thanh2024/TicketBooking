import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, Calendar, MapPin, Tag, Image as ImageIcon } from 'lucide-react';
import { createEventSchema, type CreateEventFormData } from '../../../application/events/EventSchemas';
import { useCreateEvent } from '../../hooks/useOrganizer';
import { useCategories } from '../../hooks/useCategories';
import { Button } from '../../../shared/components/Button';

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const createEventMutation = useCreateEvent();
  const { data: categoriesData } = useCategories();
  
  const categories = categoriesData?.data || [];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      ticketTypes: [
        { name: 'Vé Thường', price: 0, totalQuantity: 100, saleStartTime: '', saleEndTime: '' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ticketTypes',
  });

  const onSubmit = async (data: CreateEventFormData) => {
    try {
      // Backend expecting CategoryId, which is mapped from data.categoryId in schema
      const result = await createEventMutation.mutateAsync(data);
      if (result.isSuccess) {
        navigate('/organizer');
      } else {
        alert(result.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo sự kiện');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Tạo sự kiện mới</h1>
      
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
                placeholder="Nhập tên sự kiện"
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
                placeholder="Mô tả chi tiết về sự kiện..."
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
                  placeholder="https://example.com/image.jpg"
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
                placeholder="Tên địa điểm, Số nhà, Đường, Phường, Quận, Thành phố"
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
            </div>
          </div>
        </div>

        {/* Ticket Types */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-blue-500" /> Các loại vé
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: '', price: 0, totalQuantity: 100, saleStartTime: '', saleEndTime: '' })}
            >
              <Plus className="w-4 h-4 mr-1" /> Thêm loại vé
            </Button>
          </div>
          
          {errors.ticketTypes?.message && typeof errors.ticketTypes.message === 'string' && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{errors.ticketTypes.message}</p>
          )}

          <div className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative">
                <div className="absolute top-4 right-4">
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Xóa loại vé này"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-800 mb-4">Loại vé #{index + 1}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tên vé <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      {...register(`ticketTypes.${index}.name`)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      placeholder="VD: Vé VIP"
                    />
                    {errors.ticketTypes?.[index]?.name && <p className="mt-1 text-xs text-red-600">{errors.ticketTypes[index]?.name?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Giá vé (VNĐ) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      {...register(`ticketTypes.${index}.price`)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                    {errors.ticketTypes?.[index]?.price && <p className="mt-1 text-xs text-red-600">{errors.ticketTypes[index]?.price?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      {...register(`ticketTypes.${index}.totalQuantity`)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                    {errors.ticketTypes?.[index]?.totalQuantity && <p className="mt-1 text-xs text-red-600">{errors.ticketTypes[index]?.totalQuantity?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mở bán lúc <span className="text-red-500">*</span></label>
                    <input
                      type="datetime-local"
                      {...register(`ticketTypes.${index}.saleStartTime`)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                    {errors.ticketTypes?.[index]?.saleStartTime && <p className="mt-1 text-xs text-red-600">{errors.ticketTypes[index]?.saleStartTime?.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Kết thúc bán lúc <span className="text-red-500">*</span></label>
                    <input
                      type="datetime-local"
                      {...register(`ticketTypes.${index}.saleEndTime`)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                    {errors.ticketTypes?.[index]?.saleEndTime && <p className="mt-1 text-xs text-red-600">{errors.ticketTypes[index]?.saleEndTime?.message}</p>}
                  </div>
                  
                  <div className="lg:col-span-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mô tả (Quyền lợi, lưu ý)</label>
                    <input
                      type="text"
                      {...register(`ticketTypes.${index}.description`)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/organizer')}
          >
            Hủy bỏ
          </Button>
          <Button 
            type="submit"
            isLoading={isSubmitting || createEventMutation.isPending}
          >
            Lưu sự kiện & Chờ duyệt
          </Button>
        </div>

      </form>
    </div>
  );
};
