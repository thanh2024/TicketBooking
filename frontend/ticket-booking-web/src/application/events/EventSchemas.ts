import { z } from 'zod';

export const createTicketTypeSchema = z.object({
  name: z.string().min(1, 'Tên loại vé không được để trống'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Giá vé phải lớn hơn hoặc bằng 0'),
  totalQuantity: z.coerce.number().min(1, 'Số lượng vé phải lớn hơn 0'),
  saleStartTime: z.string().min(1, 'Vui lòng chọn thời gian mở bán'),
  saleEndTime: z.string().min(1, 'Vui lòng chọn thời gian kết thúc bán'),
}).refine(data => new Date(data.saleEndTime) > new Date(data.saleStartTime), {
  message: 'Thời gian kết thúc bán phải sau thời gian mở bán',
  path: ['saleEndTime'],
});

export const createEventSchema = z.object({
  title: z.string().min(1, 'Tên sự kiện không được để trống').max(200, 'Tên sự kiện quá dài'),
  description: z.string().optional(),
  location: z.string().min(1, 'Địa điểm không được để trống'),
  startTime: z.string().min(1, 'Vui lòng chọn thời gian bắt đầu'),
  endTime: z.string().min(1, 'Vui lòng chọn thời gian kết thúc'),
  thumbnailUrl: z.string().optional(),
  categoryId: z.string().uuid('Vui lòng chọn danh mục hợp lệ'),
  ticketTypes: z.array(createTicketTypeSchema).min(1, 'Sự kiện phải có ít nhất 1 loại vé'),
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
  message: 'Thời gian kết thúc sự kiện phải sau thời gian bắt đầu',
  path: ['endTime'],
});

export type CreateTicketTypeFormData = z.infer<typeof createTicketTypeSchema>;
export type CreateEventFormData = z.infer<typeof createEventSchema>;

export const updateEventSchema = z.object({
  title: z.string().min(1, 'Tên sự kiện không được để trống').max(200, 'Tên sự kiện quá dài'),
  description: z.string().optional(),
  location: z.string().min(1, 'Địa điểm không được để trống'),
  startTime: z.string().min(1, 'Vui lòng chọn thời gian bắt đầu'),
  endTime: z.string().min(1, 'Vui lòng chọn thời gian kết thúc'),
  thumbnailUrl: z.string().optional(),
  categoryId: z.string().uuid('Vui lòng chọn danh mục hợp lệ'),
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
  message: 'Thời gian kết thúc sự kiện phải sau thời gian bắt đầu',
  path: ['endTime'],
});

export type UpdateEventFormData = z.infer<typeof updateEventSchema>;
