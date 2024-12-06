import { Button } from '@/components/ui/button';
import { Clock, MapPin, Store, UtensilsCrossed, Phone } from 'lucide-react';
import { FoodOffer } from '@/lib/types';

interface OfferInfoProps {
  offer: FoodOffer;
}

export function OfferInfo({ offer }: OfferInfoProps) {
  return (
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
  );
}