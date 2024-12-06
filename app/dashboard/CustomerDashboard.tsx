'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { FoodOffer } from '@/lib/types';
import { FoodOfferCard } from '@/components/customer/FoodOfferCard';
import { requestNotificationPermission, showNotification } from '@/lib/notifications';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function CustomerDashboard() {
  const [offers, setOffers] = useState<FoodOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const now = new Date();
    const q = query(
      collection(db, 'offers'),
      where('validTill', '>', now),
      orderBy('validTill', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const offerData: FoodOffer[] = [];
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          showNotification('New Offer Available!', {
            body: `${change.doc.data().name} from ${change.doc.data().hotelName}`,
            icon: '/icons/icon-192x192.png'
          });
        }
      });

      snapshot.forEach((doc) => {
        offerData.push({
          id: doc.id,
          ...doc.data(),
          hotelDistance: 0 // Temporary fix until location is implemented
        } as FoodOffer);
      });

      setOffers(offerData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-2xl font-bold">Available Offers</h2>
      {offers.length === 0 ? (
        <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-gray-800">
          <p className="text-lg text-muted-foreground">No offers available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <FoodOfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}