'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { FoodOffer } from '@/lib/types';
import { FoodOfferCard } from '@/components/customer/FoodOfferCard';
import { useGeolocation } from '@/hooks/useGeolocation';
import { requestNotificationPermission, showNotification } from '@/lib/notifications';
import { getDistanceFromLatLonInKm } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function CustomerDashboard() {
  const [offers, setOffers] = useState<FoodOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const { latitude, longitude, error: locationError } = useGeolocation();

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!latitude || !longitude) return;

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
        const data = doc.data();
        const hotelDistance = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          data.hotelLatitude,
          data.hotelLongitude
        );
        
        offerData.push({
          id: doc.id,
          ...data,
          hotelDistance: Math.round(hotelDistance * 10) / 10
        } as FoodOffer);
      });

      setOffers(offerData.sort((a, b) => a.hotelDistance - b.hotelDistance));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [latitude, longitude]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          <p>Error: {locationError}</p>
          <p className="mt-2">Please enable location services to see nearby offers.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-2xl font-bold">Available Offers</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <FoodOfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}