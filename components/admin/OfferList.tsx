'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { FoodOffer } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function OfferList() {
  const [offers, setOffers] = useState<FoodOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'offers'));
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

  const handleDeleteOffer = async (offerId: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      await deleteDoc(doc(db, 'offers', offerId));
      setOffers(offers.filter(offer => offer.id !== offerId));
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  if (loading) return <div>Loading offers...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Hotel</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Valid Till</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers.map((offer) => (
          <TableRow key={offer.id}>
            <TableCell>
              <div className="relative h-16 w-16 overflow-hidden rounded-md">
                <Image
                  src={offer.imageUrl}
                  alt={offer.name}
                  fill
                  className="object-cover"
                />
              </div>
            </TableCell>
            <TableCell>{offer.name}</TableCell>
            <TableCell>{offer.hotelName}</TableCell>
            <TableCell>₹{offer.price}</TableCell>
            <TableCell>
              {new Date(offer.validTill).toLocaleString()}
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteOffer(offer.id)}
              >
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}