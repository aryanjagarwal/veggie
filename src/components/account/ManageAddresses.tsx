
"use client";

import { useState } from 'react';
import type { Address } from '@/lib/types';
import { mockUserAddresses } from '@/lib/mock-addresses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit3, Trash2, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ManageAddresses() {
  // For now, we use mock data. Real implementation would fetch from a backend.
  const [addresses, setAddresses] = useState<Address[]>(mockUserAddresses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleMockAction = (message: string) => {
    toast({
      title: "Mock Feature",
      description: `${message} - This functionality requires backend integration.`,
      variant: "default",
    });
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
    handleMockAction(`Editing address "${address.street}"`);
  };
  
  const openAddDialog = () => {
    setEditingAddress(null); // For a new address
    setIsDialogOpen(true);
    handleMockAction("Adding a new address");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={openAddDialog} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">You have no saved addresses.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className={`shadow-md ${address.isDefault ? 'border-primary border-2' : ''}`}>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  {address.street}
                  {address.isDefault && (
                    <Badge className="ml-2 bg-primary/20 text-primary border-primary/50 hover:bg-primary/30 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> Default
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button variant="ghost" size="sm" onClick={() => openEditDialog(address)}>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80" onClick={() => handleMockAction(`Deleting address "${address.street}"`)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
                {!address.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleMockAction(`Setting "${address.street}" as default`)}>
                    Set as Default
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for Add/Edit - Mock functionality */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address (Mock)' : 'Add New Address (Mock)'}</DialogTitle>
            <DialogDescription>
              {editingAddress ? `Modify the details for ${editingAddress.street}.` : 'Enter the details for your new address.'}
              <br/> <span className="text-xs text-amber-600 font-semibold">(This is a mock form. Data will not be saved.)</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">Street</Label>
              <Input id="street" defaultValue={editingAddress?.street || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">City</Label>
              <Input id="city" defaultValue={editingAddress?.city || ""} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">State/Province</Label>
              <Input id="state" defaultValue={editingAddress?.state || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zipCode" className="text-right">ZIP/Postal Code</Label>
              <Input id="zipCode" defaultValue={editingAddress?.zipCode || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">Country</Label>
              <Input id="country" defaultValue={editingAddress?.country || "USA"} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={() => { setIsDialogOpen(false); handleMockAction("Address form submitted"); }}>Save Address (Mock)</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
