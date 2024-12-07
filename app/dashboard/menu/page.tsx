'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { MenuItem } from '@/lib/types';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { AddMenuItemForm } from '@/components/hotel/AddMenuItemForm';
import { MenuItemCard } from '@/components/hotel/MenuItemCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function MenuPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
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
  }, [user]);

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await deleteDoc(doc(db, 'menuItems', itemId));
      setMenuItems(menuItems.filter(item => item.id !== itemId));
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
          <h2 className="text-2xl font-bold">Your Menu Items</h2>
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