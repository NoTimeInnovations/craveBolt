'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FoodOffer } from '@/lib/types';
import { FoodOfferCard } from '@/components/customer/FoodOfferCard';

export function CustomerDashboard() {
  const [offers, setOffers] = useState<FoodOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const now = new Date();
        const q = query(
          collection(db, 'offers'),
          where('validTill', '>', now)
        );
        
        const querySnapshot = await getDocs(q);
        const offerData: FoodOffer[] = [];
        
        querySnapshot.forEach((doc) => {
          offerData.push({ id: doc.id, ...doc.data() } as FoodOffer);
        });
        
        setOffers(offerData);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleOrder = (offerId: string) => {
    // Implement order functionality
    console.log('Ordering:', offerId);
  };

  if (loading) {
    return <div>Loading offers...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="mb-6 text-2xl font-bold">Available Offers</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <FoodOfferCard
            key={offer.id}
            offer={offer}
            onOrder={handleOrder}
          />
        ))}
      </div>
    </div>
  );
}