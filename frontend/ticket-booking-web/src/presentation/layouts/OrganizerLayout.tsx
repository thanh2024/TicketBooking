import React from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Calendar, Ticket, DollarSign, LayoutDashboard, QrCode, LogOut } from 'lucide-react';

export const OrganizerLayout: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Tổng quan', path: '/organizer', icon: LayoutDashboard, exact: true },
    { name: 'Sự kiện', path: '/organizer/events', icon: Calendar },
    { name: 'Đơn hàng', path: '/organizer/orders', icon: Ticket },
    { name: 'Check-in', path: '/organizer/check-in', icon: QrCode },
    { name: 'Doanh thu', path: '/organizer/revenue', icon: DollarSign },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-slate-900">
        <div className="flex items-center justify-center h-16 bg-slate-950 px-4">
          <span className="text-white font-bold text-xl uppercase tracking-wider truncate">Kênh BTC</span>
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
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-slate-300 truncate px-2">{user?.fullName}</span>
          </div>
          <button
            onClick={logout}
            className="group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-slate-400 group-hover:text-white" />
            Đăng xuất
          </button>
          <Link to="/" className="mt-2 block text-center text-xs text-slate-500 hover:text-slate-300">Về trang chủ</Link>
        </div>
      </div>

      {/* Main content */}
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
