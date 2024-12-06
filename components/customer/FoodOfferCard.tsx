import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Store } from 'lucide-react';
import Image from 'next/image';
import { FoodOffer } from '@/lib/types';
import Link from 'next/link';

interface FoodOfferCardProps {
  offer: FoodOffer;
}

export function FoodOfferCard({ offer }: FoodOfferCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={offer.imageUrl}
          alt={offer.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">{offer.name}</h3>
          <span className="text-lg font-bold">₹{offer.price}</span>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Store className="h-4 w-4" />
            <span>{offer.hotelName}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{offer.hotelDistance}km away</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Valid till {new Date(offer.validTill).toLocaleTimeString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/offer/${offer.id}`} className="w-full">
          <Button className="w-full">
            Check it out
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}