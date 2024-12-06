'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FoodOffer } from '@/lib/types';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { OfferImage } from './OfferImage';
import { OfferInfo } from './OfferInfo';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function OfferDetails() {
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
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Offer not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <div className="container mx-auto p-6">
        <div className="grid gap-8 md:grid-cols-2">
          <OfferImage offer={offer} />
          <OfferInfo offer={offer} />
        </div>
      </div>
    </div>
  );
}