'use client';

import { MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';

interface MenuItemCardProps {
  item: MenuItem;
  onDelete: (id: string) => void;
}

export function MenuItemCard({ item, onDelete }: MenuItemCardProps) {
  return (
    <div className="relative rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <h3 className="font-semibold">{item.name}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-lg font-bold">₹{item.price}</span>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary">
          {item.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
        </span>
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="absolute right-4 top-4"
        onClick={() => onDelete(item.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}