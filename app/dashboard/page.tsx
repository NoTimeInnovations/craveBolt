'use client';

import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CustomerDashboard } from './CustomerDashboard';
import { HotelDashboard } from './HotelDashboard';
import { AdminDashboard } from './AdminDashboard';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner />
        <p className="mt-4 text-sm text-muted-foreground">
          Preparing your experience...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <div className="text-center">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Welcome to Crave</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to access your dashboard
          </p>
          <Link href="/" className="mt-6 inline-block">
            <Button size="lg">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    );
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