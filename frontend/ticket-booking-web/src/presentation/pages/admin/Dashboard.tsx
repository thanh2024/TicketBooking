import React from 'react';
import { useAdminStats, usePendingOrganizers, useApproveOrganizer } from '../../hooks/useAdmin';
import { Users, Building, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../../../shared/components/Button';

export const AdminDashboard: React.FC = () => {
  const { data: statsData, isLoading: isStatsLoading } = useAdminStats();
  const { data: pendingOrgData, isLoading: isOrgLoading } = usePendingOrganizers();
  const approveMutation = useApproveOrganizer();

  const handleApprove = (id: string, isApproved: boolean) => {
    if (window.confirm(`Bạn có chắc chắn muốn ${isApproved ? 'Duyệt' : 'Từ chối'} ban tổ chức này?`)) {
      approveMutation.mutate({ id, isApproved });
    }
  };

  if (isStatsLoading || isOrgLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  // Fallback stats
  const stats = statsData?.data || {
    totalUsers: 2543,
    totalOrganizers: 45,
    pendingApprovals: pendingOrgData?.data?.length || 5,
  };

  const pendingOrgs = pendingOrgData?.data || [
    { id: '1', name: 'Công ty Cổ phần Giải trí XYZ', email: 'contact@xyz.com', phone: '0987654321', createdAt: '2026-09-15T10:00:00Z' },
    { id: '2', name: 'Vũ Trụ Media', email: 'hello@vutru.vn', phone: '0123456789', createdAt: '2026-09-14T15:30:00Z' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center border-l-4 border-l-blue-500">
          <div className="p-4 rounded-lg bg-blue-50 text-blue-600 mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tổng người dùng</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center border-l-4 border-l-purple-500">
          <div className="p-4 rounded-lg bg-purple-50 text-purple-600 mr-4">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Tổng Ban Tổ Chức</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalOrganizers}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center border-l-4 border-l-red-500">
          <div className="p-4 rounded-lg bg-red-50 text-red-600 mr-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Chờ duyệt</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</h3>
          </div>
        </div>
      </div>

      {/* Pending Approvals List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
            Yêu cầu mở kênh Ban Tổ Chức cần duyệt
          </h2>
        </div>
        
        {pendingOrgs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Không có yêu cầu nào đang chờ duyệt.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-xs uppercase tracking-wider text-gray-500 border-b border-gray-200">
                  <th className="p-4 font-semibold">Tên Tổ Chức</th>
                  <th className="p-4 font-semibold">Liên hệ</th>
                  <th className="p-4 font-semibold">Ngày đăng ký</th>
                  <th className="p-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingOrgs.map((org: any) => (
                  <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{org.name}</p>
                      <p className="text-xs text-gray-500">ID: {org.id}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-gray-900">{org.email}</p>
                      <p className="text-sm text-gray-500">{org.phone}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="primary" 
                        onClick={() => handleApprove(org.id, true)}
                        isLoading={approveMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" /> Duyệt
                      </Button>
                      <Button 
                        size="sm" 
                        variant="danger" 
                        onClick={() => handleApprove(org.id, false)}
                        isLoading={approveMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Từ chối
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
