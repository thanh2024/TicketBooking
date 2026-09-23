import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Users, Calendar, LayoutDashboard, CreditCard, LogOut, CheckCircle, ShoppingCart } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Người dùng', path: '/admin/users', icon: Users },
    { name: 'Duyệt BTC', path: '/admin/organizers', icon: CheckCircle },
    { name: 'Quản lý Sự kiện', path: '/admin/events', icon: Calendar },
    { name: 'Quản lý Đơn hàng', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Giao dịch', path: '/admin/payments', icon: CreditCard },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <div className="flex flex-col w-64 bg-red-900">
        <div className="flex items-center justify-center h-16 bg-red-950 px-4">
          <span className="text-white font-bold text-xl uppercase tracking-wider truncate">ADMIN TICKET</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive ? 'bg-red-700 text-white' : 'text-red-100 hover:bg-red-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-red-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-red-100 truncate px-2">{user?.fullName}</span>
          </div>
          <button
            onClick={logout}
            className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-red-100 hover:bg-red-800 hover:text-white"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-red-300 group-hover:text-white" />
            Đăng xuất
          </button>
          <Link to="/" className="mt-2 block text-center text-xs text-red-300 hover:text-red-100">Về trang chủ</Link>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
