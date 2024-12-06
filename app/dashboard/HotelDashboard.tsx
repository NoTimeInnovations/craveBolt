'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { FoodOffer } from '@/lib/types';
import { AddOfferForm } from '@/components/hotel/AddOfferForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed } from 'lucide-react';

export function HotelDashboard() {
  const { user } = useAuth();
  const [offers, setOffers] = useState<FoodOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'offers'),
          where('hotelId', '==', user.uid)
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
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Active Offers</h2>
        <Link href="/dashboard/menu">
          <Button variant="outline">
            <UtensilsCrossed className="mr-2 h-4 w-4" />
            Food Menu
          </Button>
        </Link>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <h3 className="font-semibold">{offer.name}</h3>
            <p className="mt-1 text-2xl font-bold">₹{offer.price}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Valid till: {new Date(offer.validTill).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <AddOfferForm />
      </div>
    </div>
  );
}