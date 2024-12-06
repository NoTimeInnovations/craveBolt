'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { MenuItem } from '@/lib/types';

export function AddOfferForm() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    itemId: '',
    discountPrice: '',
    validTill: '',
    description: '',
  });

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'menuItems'),
          where('hotelId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const items: MenuItem[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() } as MenuItem);
        });
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, [user]);

  const handleItemSelect = (itemId: string) => {
    const item = menuItems.find((i) => i.id === itemId);
    setSelectedItem(item || null);
    setFormData({
      ...formData,
      itemId,
      discountPrice: item ? item.price.toString() : '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedItem) return;

    try {
      setLoading(true);
      const validTill = new Date(formData.validTill);

      await addDoc(collection(db, 'offers'), {
        hotelId: user.uid,
        hotelName: user.displayName || '',
        menuItemId: formData.itemId,
        name: selectedItem.name,
        description: formData.description,
        originalPrice: selectedItem.price,
        price: parseFloat(formData.discountPrice),
        imageUrl: selectedItem.imageUrl,
        validTill,
        createdAt: new Date(),
      });

      setOpen(false);
      setFormData({
        itemId: '',
        discountPrice: '',
        validTill: '',
        description: '',
      });
      setSelectedItem(null);
    } catch (error) {
      console.error('Error adding offer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Add New Offer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Offer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="itemId">Select Menu Item</Label>
            <Select
              value={formData.itemId}
              onValueChange={handleItemSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a menu item" />
              </SelectTrigger>
              <SelectContent>
                {menuItems.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} - ₹{item.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedItem && (
            <>
              <div>
                <Label htmlFor="discountPrice">Offer Price (₹)</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  min="0"
                  max={selectedItem.price}
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPrice: e.target.value })
                  }
                  required
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  Original price: ₹{selectedItem.price}
                </p>
              </div>

              <div>
                <Label htmlFor="validTill">Valid Till</Label>
                <Input
                  id="validTill"
                  type="datetime-local"
                  value={formData.validTill}
                  onChange={(e) =>
                    setFormData({ ...formData, validTill: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !selectedItem}
          >
            {loading ? 'Creating...' : 'Create Offer'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}