import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { OfferDetails } from '@/components/offer/OfferDetails';

export const metadata: Metadata = {
  title: 'Offer Details - Crave',
  description: 'View offer details and place your order',
};

// Required for static site generation with dynamic routes
export async function generateStaticParams() {
  try {
    const offers = await getDocs(collection(db, 'offers'));
    return offers.docs.map((doc) => ({
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default function OfferPage() {
  return <OfferDetails />;
}