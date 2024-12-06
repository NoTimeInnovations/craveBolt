'use client';

import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CustomerDashboard } from './CustomerDashboard';
import { HotelDashboard } from './HotelDashboard';
import { AdminDashboard } from './AdminDashboard';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      
      {user.role === 'customer' && <CustomerDashboard />}
      {user.role === 'hotel' && <HotelDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
    </div>
  );
}