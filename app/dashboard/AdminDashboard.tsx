'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Store, Menu } from 'lucide-react';

export function AdminDashboard() {
  const [activeSection, setActiveSection] = useState<'users' | 'hotels' | 'menus'>('users');

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="w-64 border-r bg-white p-4 dark:bg-gray-800">
        <nav className="space-y-2">
          <Button
            variant={activeSection === 'users' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSection('users')}
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </Button>
          <Button
            variant={activeSection === 'hotels' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSection('hotels')}
          >
            <Store className="mr-2 h-4 w-4" />
            Hotels
          </Button>
          <Button
            variant={activeSection === 'menus' ? 'default' : 'ghost'}
            className="w-full justify-start"
            onClick={() => setActiveSection('menus')}
          >
            <Menu className="mr-2 h-4 w-4" />
            Menus
          </Button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {activeSection === 'users' && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">User Management</h2>
            {/* User management content */}
          </div>
        )}
        
        {activeSection === 'hotels' && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">Hotel Management</h2>
            {/* Hotel management content */}
          </div>
        )}
        
        {activeSection === 'menus' && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">Menu Management</h2>
            {/* Menu management content */}
          </div>
        )}
      </main>
    </div>
  );
}