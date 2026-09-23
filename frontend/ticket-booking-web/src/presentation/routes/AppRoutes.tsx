import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useGetMe } from '../hooks/useAuth';

import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { OrganizerLayout } from '../layouts/OrganizerLayout';
import { AdminLayout } from '../layouts/AdminLayout';

import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

import { Home } from '../pages/public/Home';
import { EventList } from '../pages/public/EventList';
import { EventDetail } from '../pages/public/EventDetail';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { MyTickets } from '../pages/customer/MyTickets';
import { MyOrders } from '../pages/customer/MyOrders';
import { Checkout } from '../pages/customer/Checkout';
import { PaymentResult } from '../pages/customer/PaymentResult';
import { Profile } from '../pages/customer/Profile';
import { OrganizerDashboard } from '../pages/organizer/Dashboard';
import { OrganizerEvents } from '../pages/organizer/Events';
import { CreateEvent } from '../pages/organizer/CreateEvent';
import { EditEvent } from '../pages/organizer/EditEvent';
import { OrganizerOrders } from '../pages/organizer/Orders';
import { OrganizerRevenue } from '../pages/organizer/Revenue';
import { OrganizerCheckIn } from '../pages/organizer/CheckIn';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { AdminUsers } from '../pages/admin/Users';
import { AdminOrganizers } from '../pages/admin/Organizers';
import { AdminEvents } from '../pages/admin/Events';
import { AdminOrders } from '../pages/admin/Orders';
import { AdminPayments } from '../pages/admin/Payments';
import { NotFound } from '../pages/NotFound';
import { UserRole } from '../../domain/enums/UserRole';

export const AppRoutes: React.FC = () => {
  useGetMe(); // Hydrate user state if token exists on page reload

  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        
        {/* Protected Customer Routes with MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/:id" element={<PaymentResult />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<div>Forgot Password</div>} />
        <Route path="/reset-password" element={<div>Reset Password</div>} />
      </Route>

      {/* Organizer Routes */}
      <Route element={<RoleRoute allowedRoles={[UserRole.ORGANIZER, UserRole.ADMIN]} />}>
        <Route path="/organizer" element={<OrganizerLayout />}>
          <Route index element={<OrganizerDashboard />} />
          <Route path="events" element={<OrganizerEvents />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/:id/edit" element={<EditEvent />} />
          <Route path="orders" element={<OrganizerOrders />} />
          <Route path="check-in" element={<OrganizerCheckIn />} />
          <Route path="revenue" element={<OrganizerRevenue />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<RoleRoute allowedRoles={[UserRole.ADMIN]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="organizers" element={<AdminOrganizers />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="payments" element={<AdminPayments />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
