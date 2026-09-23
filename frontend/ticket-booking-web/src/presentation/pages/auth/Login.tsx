import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../../../application/auth/AuthSchemas';
import { useLogin } from '../../hooks/useAuth';
import { Button } from '../../../shared/components/Button';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Get redirect path or default to home
  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg(null);
    try {
      const result = await loginMutation.mutateAsync(data);
      if (result.isSuccess) {
        navigate(from, { replace: true });
      } else {
        setErrorMsg(result.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } catch (error: any) {
      setErrorMsg(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Chào mừng trở lại</h2>
        <p className="text-gray-500 mt-2 text-sm">Đăng nhập vào tài khoản của bạn để tiếp tục</p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } rounded-lg shadow-sm sm:text-sm`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              {...register('password')}
              className={`block w-full pl-10 pr-3 py-2 border ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              } rounded-lg shadow-sm sm:text-sm`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting || loginMutation.isPending}
          >
            Đăng nhập
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
