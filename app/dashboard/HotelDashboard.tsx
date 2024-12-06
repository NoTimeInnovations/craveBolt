'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { FoodOffer } from '@/lib/types';
import { AddOfferForm } from '@/components/hotel/AddOfferForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UtensilsCrossed, Trash2 } from 'lucide-react';
import Image from 'next/image';

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

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      await deleteDoc(doc(db, 'offers', offerId));
      setOffers(offers.filter(offer => offer.id !== offerId));
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

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
            className="relative rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
          >
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
              <Image
                src={offer.imageUrl}
                alt={offer.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-semibold">{offer.name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl font-bold">₹{offer.price}</span>
              {offer.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{offer.originalPrice}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Valid till: {new Date(offer.validTill).toLocaleString()}
            </p>
            <Button
              variant="destructive"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => handleDeleteOffer(offer.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <AddOfferForm />
      </div>
    </div>
  );
}