'use client';

import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MapPin, LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function DashboardHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">{user?.location || 'Set Location'}</span>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleLogout}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || ''} />
            <AvatarFallback>{user?.displayName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </div>
    </header>
  );
}