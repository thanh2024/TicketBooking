import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const MainLayout: React.FC = () => {
  const { isAuthenticated, user, isLoading, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                TicketBooking
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/events" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium">
                  Sự kiện
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <div className="w-6 h-6 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
              ) : isAuthenticated && user ? (
                <>
                  <Link to="/my-tickets" className="text-gray-700 hover:text-blue-600 font-medium text-sm">Vé của tôi</Link>
                  <div className="relative group cursor-pointer py-2">
                    <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
                    <div className="absolute right-0 top-full pt-1 w-48 hidden group-hover:block z-50">
                      <div className="bg-white border rounded shadow-lg py-1">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hồ sơ</Link>
                        <Link to="/my-orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Lịch sử đơn hàng</Link>
                        {user?.roles.includes('ORGANIZER') && (
                          <Link to="/organizer" className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-100">Kênh Ban Tổ Chức</Link>
                        )}
                        {user?.roles.includes('ADMIN') && (
                          <Link to="/admin" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Quản trị viên</Link>
                        )}
                        <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Đăng xuất</button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium text-sm">Đăng nhập</Link>
                  <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition">Đăng ký</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TicketBooking. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
