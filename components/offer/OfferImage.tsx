import Image from 'next/image';
import { FoodOffer } from '@/lib/types';

interface OfferImageProps {
  offer: FoodOffer;
}

export function OfferImage({ offer }: OfferImageProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg">
      <Image
        src={offer.imageUrl}
        alt={offer.name}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}