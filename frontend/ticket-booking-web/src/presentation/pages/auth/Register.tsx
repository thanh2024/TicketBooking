import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '../../../application/auth/AuthSchemas';
import { useRegister } from '../../hooks/useAuth';
import { Button } from '../../../shared/components/Button';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setErrorMsg(null);
    try {
      const { confirmPassword, ...registerData } = data; // Omit confirmPassword
      const result = await registerMutation.mutateAsync(registerData);
      
      if (result.isSuccess) {
        // Option 1: auto login (if backend returns tokens)
        // Option 2: redirect to login
        navigate('/login', { state: { message: 'Đăng ký thành công! Vui lòng đăng nhập.' } });
      } else {
        setErrorMsg(result.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra, email hoặc số điện thoại có thể đã được sử dụng.');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tạo tài khoản mới</h2>
        <p className="text-gray-500 mt-2 text-sm">Tham gia cùng chúng tôi để đặt vé dễ dàng hơn</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register('fullName')}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.fullName ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } rounded-lg shadow-sm sm:text-sm`}
              placeholder="Nguyễn Văn A"
            />
          </div>
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              {...register('email')}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } rounded-lg shadow-sm sm:text-sm`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-gray-400 font-normal">(Tùy chọn)</span></label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register('phoneNumber')}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } rounded-lg shadow-sm sm:text-sm`}
              placeholder="0987654321"
            />
          </div>
          {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              {...register('password')}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.password ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } rounded-lg shadow-sm sm:text-sm`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              {...register('confirmPassword')}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } rounded-lg shadow-sm sm:text-sm`}
              placeholder="••••••••"
            />
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting || registerMutation.isPending}
          >
            Đăng ký
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
