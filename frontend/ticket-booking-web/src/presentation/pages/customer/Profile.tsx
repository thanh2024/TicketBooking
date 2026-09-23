import React, { useState } from 'react';
import { useUserProfile } from '../../hooks/useUsers';
import { useRegisterOrganizer } from '../../hooks/useOrganizer';
import {
  User, Mail, Shield, Calendar, Edit3, Key,
  Building2, Phone, FileText, X, CheckCircle, ChevronRight, Loader2
} from 'lucide-react';
import { Button } from '../../../shared/components/Button';

interface OrganizerFormData {
  name: string;
  description: string;
  phone: string;
  email: string;
  logoUrl: string;
}

export const Profile: React.FC = () => {
  const { data: profileData, isLoading, isError, error } = useUserProfile();
  const registerOrganizerMutation = useRegisterOrganizer();

  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState<OrganizerFormData>({
    name: '',
    description: '',
    phone: '',
    email: '',
    logoUrl: '',
  });

  const user = profileData?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] flex-col text-red-500">
        <p>Lỗi: Không thể tải thông tin hồ sơ.</p>
        <p className="text-sm">{(error as any)?.message}</p>
      </div>
    );
  }

  const isCustomerOnly = user.roles.includes('CUSTOMER') && !user.roles.includes('ORGANIZER') && !user.roles.includes('ADMIN');
  const isOrganizer = user.roles.includes('ORGANIZER');

  const formatRoles = (roles: string[]) => {
    return roles.map(role => {
      switch (role) {
        case 'ADMIN': return 'Quản trị viên';
        case 'ORGANIZER': return 'Ban Tổ Chức';
        case 'CUSTOMER': return 'Khách hàng';
        default: return role;
      }
    }).join(', ');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setFormError('');
  };

  const handleOpenModal = () => {
    setForm(f => ({ ...f, email: user.email || '', name: user.fullName || '' }));
    setFormError('');
    setRegisterSuccess(false);
    setShowOrganizerModal(true);
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return setFormError('Vui lòng nhập tên ban tổ chức.');
    if (!form.phone.trim()) return setFormError('Vui lòng nhập số điện thoại.');
    if (!form.email.trim()) return setFormError('Vui lòng nhập email liên hệ.');

    try {
      const result = await registerOrganizerMutation.mutateAsync({
        name: form.name,
        description: form.description || undefined,
        phone: form.phone,
        email: form.email,
        logoUrl: form.logoUrl || undefined,
      });

      if (result.isSuccess) {
        setRegisterSuccess(true);
      } else {
        setFormError(result.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Hồ sơ cá nhân</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover & Avatar Header */}
        <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8 flex items-end">
            <div className="w-28 h-28 bg-white rounded-full p-1 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
              <div className="flex items-center mt-2 space-x-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  {formatRoles(user.roles)}
                </span>
                <span className="text-sm text-gray-500">Thành viên từ {formatDate(user.createdAt)}</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center shadow-sm">
                <Edit3 className="w-4 h-4 mr-2" /> Cập nhật
              </Button>
              <Button variant="secondary" className="flex items-center shadow-sm">
                <Key className="w-4 h-4 mr-2" /> Đổi mật khẩu
              </Button>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Thông tin liên hệ</h3>

            <div className="flex items-start">
              <div className="p-2 bg-gray-50 rounded-lg mr-4">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                <p className="text-base text-gray-900 font-medium">{user.fullName}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 bg-gray-50 rounded-lg mr-4">
                <Mail className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Địa chỉ Email</p>
                <p className="text-base text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="p-2 bg-gray-50 rounded-lg mr-4">
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ngày tham gia</p>
                <p className="text-base text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Thiết lập tài khoản</h3>

            <div className="p-5 bg-blue-50 border border-blue-100 rounded-xl">
              <h4 className="font-semibold text-blue-900 mb-1 flex items-center">
                <Shield className="w-4 h-4 mr-2" /> Bảo mật & Phân quyền
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                Tài khoản của bạn được cấp quyền truy cập: <strong className="font-bold">{formatRoles(user.roles)}</strong>.
                Vui lòng bảo mật thông tin đăng nhập.
              </p>
            </div>

            {/* Become Organizer Section */}
            {isCustomerOnly && (
              <div className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-violet-100 rounded-lg flex-shrink-0">
                    <Building2 className="w-5 h-5 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-violet-900 mb-1">Trở thành Ban Tổ Chức?</h4>
                    <p className="text-sm text-violet-700 mb-3">
                      Đăng ký để tạo và quản lý sự kiện, bán vé và tiếp cận hàng nghìn khán giả.
                    </p>
                    <button
                      onClick={handleOpenModal}
                      className="inline-flex items-center px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors"
                    >
                      Đăng ký ngay <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Already Organizer Notice */}
            {isOrganizer && (
              <div className="p-5 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">Bạn là Ban Tổ Chức</p>
                  <p className="text-xs text-green-600 mt-0.5">Truy cập trang quản lý để tạo và quản lý sự kiện.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Organizer Registration Modal */}
      {showOrganizerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Đăng ký Ban Tổ Chức</h3>
                  <p className="text-violet-200 text-xs mt-0.5">Yêu cầu sẽ được Admin xem xét và phê duyệt</p>
                </div>
              </div>
              <button
                onClick={() => setShowOrganizerModal(false)}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {registerSuccess ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Gửi yêu cầu thành công!</h4>
                  <p className="text-gray-500 text-sm mb-6">
                    Yêu cầu của bạn đã được ghi nhận. Admin sẽ xem xét và phê duyệt trong thời gian sớm nhất. Bạn sẽ nhận thông báo khi có kết quả.
                  </p>
                  <Button onClick={() => setShowOrganizerModal(false)} className="w-full">
                    Đóng
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmitRegister} className="space-y-4">
                  {/* Error */}
                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      {formError}
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên ban tổ chức <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleFormChange}
                        placeholder="VD: Công ty Sự kiện XYZ"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Phone & Email in 2 cols */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleFormChange}
                          placeholder="0912 345 678"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email liên hệ <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleFormChange}
                          placeholder="contact@example.com"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới thiệu về ban tổ chức
                    </label>
                    <div className="relative">
                      <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        rows={3}
                        placeholder="Mô tả ngắn về ban tổ chức, lĩnh vực hoạt động..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Logo URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Logo (tuỳ chọn)
                    </label>
                    <input
                      type="url"
                      name="logoUrl"
                      value={form.logoUrl}
                      onChange={handleFormChange}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                    />
                  </div>

                  {/* Notice */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                    ⚠️ Sau khi gửi yêu cầu, Admin sẽ xem xét thông tin và phê duyệt trong 1–3 ngày làm việc.
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowOrganizerModal(false)}
                      className="flex-1"
                    >
                      Hủy bỏ
                    </Button>
                    <button
                      type="submit"
                      disabled={registerOrganizerMutation.isPending}
                      className="flex-1 flex items-center justify-center px-4 py-2.5 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    >
                      {registerOrganizerMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang gửi...
                        </>
                      ) : (
                        <>
                          <Building2 className="w-4 h-4 mr-2" /> Gửi yêu cầu
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
