'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FoodOffer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Store, UtensilsCrossed, Phone } from 'lucide-react';
import Image from 'next/image';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default function OfferPage() {
  const { id } = useParams();
  const [offer, setOffer] = useState<FoodOffer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const offerDoc = await getDoc(doc(db, 'offers', id as string));
        if (offerDoc.exists()) {
          setOffer({ id: offerDoc.id, ...offerDoc.data() } as FoodOffer);
        }
      } catch (error) {
        console.error('Error fetching offer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!offer) {
    return <div>Offer not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <div className="container mx-auto p-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={offer.imageUrl}
              alt={offer.name}
              fill
              className="object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{offer.name}</h1>
              <div className="mt-2 flex items-center text-2xl font-bold text-primary">
                <span>₹{offer.price}</span>
                {offer.originalPrice && (
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    ₹{offer.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                <span className="font-medium">{offer.hotelName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <span>{offer.hotelDistance}km away</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>Valid till {new Date(offer.validTill).toLocaleString()}</span>
              </div>
              {offer.hotelPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>{offer.hotelPhone}</span>
                </div>
              )}
            </div>

            {offer.description && (
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Description</h2>
                <p className="text-muted-foreground">{offer.description}</p>
              </div>
            )}

            <div className="space-y-4">
              <Button size="lg" className="w-full">
                <UtensilsCrossed className="mr-2 h-5 w-5" />
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}