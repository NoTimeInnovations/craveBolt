'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { AddMenuItemForm } from '@/components/hotel/AddMenuItemForm';
import { MenuItemCard } from '@/components/hotel/MenuItemCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useMenuStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MenuItem } from '@/lib/types';

export default function MenuPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { menuItems, setMenuItems, removeMenuItem } = useMenuStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'menuItems'),
          where('hotelId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const items: MenuItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MenuItem);
        });
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [user, setMenuItems]);

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'menuItems', itemId));
      removeMenuItem(itemId);
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-2xl font-bold">Your Menu Items</h2>
          </div>
          <AddMenuItemForm />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}