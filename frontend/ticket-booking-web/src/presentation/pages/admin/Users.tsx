import React, { useState } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  Lock, 
  Unlock, 
  Shield, 
  UserCheck, 
  UserX, 
  Calendar, 
  Mail, 
  AlertTriangle 
} from 'lucide-react';
import { useAdminUsers, useLockUser, useUnlockUser } from '../../hooks/useAdmin';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../../shared/components/Button';
import type { AdminUser } from '../../../domain/entities/AdminUser';

export const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { data: usersData, isLoading } = useAdminUsers();
  const lockUser = useLockUser();
  const unlockUser = useUnlockUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionType, setActionType] = useState<'LOCK' | 'UNLOCK' | null>(null);

  const users = usersData?.data || [];

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = 
      roleFilter === 'ALL' || 
      u.roles.some((r) => r.toUpperCase() === roleFilter.toUpperCase());

    const matchesStatus = 
      statusFilter === 'ALL' || 
      (statusFilter === 'ACTIVE' && u.isActive) ||
      (statusFilter === 'LOCKED' && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const totalCount = users.length;
  const activeCount = users.filter(u => u.isActive).length;
  const lockedCount = users.filter(u => !u.isActive).length;
  const organizerCount = users.filter(u => u.roles.includes('ORGANIZER')).length;

  const handleConfirmAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      if (actionType === 'LOCK') {
        await lockUser.mutateAsync(selectedUser.id);
      } else {
        await unlockUser.mutateAsync(selectedUser.id);
      }
      setSelectedUser(null);
      setActionType(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái người dùng.');
    }
  };

  const getRoleBadge = (roleName: string) => {
    const roleUpper = roleName.toUpperCase();
    switch (roleUpper) {
      case 'ADMIN':
        return (
          <span key={roleName} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Shield className="w-3 h-3 mr-1 text-purple-600" /> Admin
          </span>
        );
      case 'ORGANIZER':
        return (
          <span key={roleName} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            Ban tổ chức
          </span>
        );
      default:
        return (
          <span key={roleName} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            Khách hàng
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <UsersIcon className="w-8 h-8 mr-3 text-blue-600" /> Quản lý Người dùng
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Xem danh sách, tìm kiếm, phân quyền và khóa/mở khóa tài khoản trong hệ thống.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng người dùng</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UsersIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Đang hoạt động</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{activeCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tài khoản bị khóa</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{lockedCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <UserX className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ban tổ chức</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{organizerCount}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo họ tên hoặc email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Lọc:</span>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="CUSTOMER">Khách hàng</option>
            <option value="ORGANIZER">Ban tổ chức</option>
            <option value="ADMIN">System Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="LOCKED">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <UserX className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">Không tìm thấy người dùng phù hợp</h3>
            <p className="text-gray-500 text-sm mt-1">Hãy thử tìm kiếm bằng từ khóa hoặc điều kiện lọc khác.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Người dùng</th>
                  <th className="py-4 px-6">Vai trò</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6">Ngày tham gia</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredUsers.map((user) => {
                  const isSelf = currentUser?.email === user.email;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* User Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
                            {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 flex items-center">
                              {user.fullName || 'Người dùng'}
                              {isSelf && (
                                <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
                                  Bạn
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center mt-0.5">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" /> {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Roles */}
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-1.5">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map(r => getRoleBadge(r))
                          ) : (
                            getRoleBadge('CUSTOMER')
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {user.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" /> Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5" /> Bị khóa
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-gray-600">
                        <div className="flex items-center text-xs">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : '—'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        {isSelf ? (
                          <span className="text-xs text-gray-400 italic">Không thể tự khóa</span>
                        ) : user.isActive ? (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType('LOCK');
                            }}
                            className="inline-flex items-center text-xs px-3 py-1.5"
                          >
                            <Lock className="w-3.5 h-3.5 mr-1" /> Khóa
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setActionType('UNLOCK');
                            }}
                            className="inline-flex items-center text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 border-none"
                          >
                            <Unlock className="w-3.5 h-3.5 mr-1" /> Mở khóa
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedUser && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              actionType === 'LOCK' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              {actionType === 'LOCK' ? <AlertTriangle className="w-8 h-8" /> : <Unlock className="w-8 h-8" />}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {actionType === 'LOCK' ? 'Xác nhận khóa tài khoản?' : 'Xác nhận mở khóa tài khoản?'}
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              Bạn có chắc chắn muốn {actionType === 'LOCK' ? 'khóa' : 'mở khóa'} tài khoản người dùng{' '}
              <strong className="text-gray-900">{selectedUser.fullName}</strong> ({selectedUser.email}) không?
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedUser(null);
                  setActionType(null);
                }}
                className="flex-1"
              >
                Hủy bỏ
              </Button>
              <Button
                variant={actionType === 'LOCK' ? 'danger' : 'primary'}
                onClick={handleConfirmAction}
                isLoading={lockUser.isPending || unlockUser.isPending}
                className={`flex-1 ${actionType === 'UNLOCK' ? 'bg-green-600 hover:bg-green-700 border-none' : ''}`}
              >
                {actionType === 'LOCK' ? 'Khoá tài khoản' : 'Mở khoá'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
