import { AxiosError } from 'axios';

export interface ApiErrorData {
  isSuccess: false;
  code: number;
  message: string;
  data: unknown;
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorData | undefined;
    if (data?.message) {
      return data.message;
    }

    switch (error.response?.status) {
      case 400:
        return 'Yêu cầu không hợp lệ';
      case 401:
        return 'Phiên đăng nhập đã hết hạn';
      case 403:
        return 'Bạn không có quyền truy cập';
      case 404:
        return 'Không tìm thấy tài nguyên';
      case 409:
        return 'Xung đột dữ liệu';
      case 422:
        return 'Dữ liệu không hợp lệ';
      case 500:
        return 'Đã xảy ra lỗi máy chủ';
      default:
        return 'Đã xảy ra lỗi không xác định';
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Đã xảy ra lỗi không xác định';
}
