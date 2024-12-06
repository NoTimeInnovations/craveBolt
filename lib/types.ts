export type UserRole = 'admin' | 'customer' | 'hotel';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
  location?: string;
}

export interface Hotel {
  id: string;
  name: string;
  email: string;
  location: string;
  description?: string;
  phoneNumber?: string;
  verified: boolean;
  createdAt: Date;
}

export interface FoodOffer {
  id: string;
  hotelId: string;
  hotelName: string;
  hotelPhone?: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  hotelDistance: number;
  validTill: Date;
  createdAt: Date;
}

export interface MenuItem {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
}