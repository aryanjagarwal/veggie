
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import type { Address } from '@/lib/types';
// Removed: import { mockUserAddresses } from '@/lib/mock-addresses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit3, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Form data structure for add/edit
type AddressFormData = Omit<Address, 'id' | 'user_id' | 'created_at'>;

export default function ManageAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    isDefault: false,
  });

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/addresses');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch addresses');
      }
      const data: Address[] = await response.json();
      // Fallback to mock data if API returns empty or error, for demonstration
      if (data.length === 0 && process.env.NODE_ENV === 'development') {
        // This is just to make it look like it's working during dev without Supabase setup
        console.warn("API returned no addresses, showing mock data for development.");
        setAddresses([
           { id: 'mock1', street: '123 Mock St', city: 'DevCity', state: 'DS', zipCode: '00001', country: 'USA', isDefault: true },
           { id: 'mock2', street: '456 Mock Ave', city: 'DevCity', state: 'DS', zipCode: '00002', country: 'USA', isDefault: false },
        ]);
      } else {
        setAddresses(data);
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      // Show mock data on error during dev for UI testing
      if (process.env.NODE_ENV === 'development') {
         console.warn("Error fetching addresses, showing mock data for development.");
         setAddresses([
           { id: 'mock1_err', street: '789 Error Rd', city: 'FailTown', state: 'ER', zipCode: '00003', country: 'USA', isDefault: false },
         ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const resetFormData = () => {
    setFormData({
      street: '', city: '', state: '', zipCode: '', country: 'USA', isDefault: false,
    });
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    resetFormData();
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault || false,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const url = editingAddress ? `/api/addresses/${editingAddress.id}` : '/api/addresses';
    const method = editingAddress ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${editingAddress ? 'update' : 'add'} address`);
      }
      toast({ title: 'Success', description: `Address ${editingAddress ? 'updated' : 'added'} successfully.` });
      setIsDialogOpen(false);
      fetchAddresses(); // Refresh list
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    setIsSubmitting(true); // Use same flag for general async operations on an address
    try {
      const response = await fetch(`/api/addresses/${addressId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete address');
      }
      toast({ title: 'Success', description: 'Address deleted successfully.' });
      fetchAddresses(); // Refresh list
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSetDefault = async (addressId: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/addresses/${addressId}/set-default`, { method: 'PATCH' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to set default address');
      }
      toast({ title: 'Success', description: 'Address set as default.' });
      fetchAddresses(); // Refresh the list to show the new default
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openAddDialog} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">You have no saved addresses. Add one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className={`shadow-md ${address.isDefault ? 'border-primary border-2' : ''}`}>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  {address.street}
                  {address.isDefault && (
                    <Badge className="ml-2 bg-primary/20 text-primary border-primary/50 hover:bg-primary/30 flex items-center gap-1 py-1 px-2">
                      <CheckCircle className="h-3 w-3" /> Default
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4 mt-4">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(address)} disabled={isSubmitting}>
                  <Edit3 className="mr-1 h-4 w-4" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80" onClick={() => handleDeleteAddress(address.id)} disabled={isSubmitting}>
                  {isSubmitting && editingAddress?.id === address.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin"/> : <Trash2 className="mr-1 h-4 w-4" />} Delete
                </Button>
                {!address.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(address.id)} disabled={isSubmitting}>
                     {isSubmitting && editingAddress?.id === address.id ? <Loader2 className="mr-1 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-1 h-4 w-4" />} Set as Default
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            <DialogDescription>
              {editingAddress ? `Modify the details for ${editingAddress.street}.` : 'Enter the details for your new address.'}
              <br/> 
              <span className="text-xs text-muted-foreground">
                (This form will interact with the backend. Ensure Supabase is set up.)
              </span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="street" className="text-right">Street</Label>
                <Input id="street" name="street" value={formData.street} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="city" className="text-right">City</Label>
                <Input id="city" name="city" value={formData.city} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">State/Prov.</Label>
                <Input id="state" name="state" value={formData.state} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="zipCode" className="text-right">ZIP/Postal</Label>
                <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="country" className="text-right">Country</Label>
                <Input id="country" name="country" value={formData.country} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="flex items-center space-x-2 col-start-2 col-span-3">
                <Input type="checkbox" id="isDefault" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="h-4 w-4"/>
                <Label htmlFor="isDefault" className="text-sm font-normal">Set as default address</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {editingAddress ? 'Save Changes' : 'Add Address'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
