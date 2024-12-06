'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { MenuItem } from '@/lib/types';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

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

  if (loading) return <div>Loading menu items...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <div className="container mx-auto p-6">
        <h2 className="mb-6 text-2xl font-bold">Your Menu Items</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
            >
              <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-md">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-2xl font-bold">₹{item.price}</span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
                  {item.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );