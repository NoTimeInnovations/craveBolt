export type UserRole = 'admin' | 'customer' | 'hotel';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  photoURL?: string;
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