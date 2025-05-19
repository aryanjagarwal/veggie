"use client";

import { useState, useEffect } from 'react';
import type { Address } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Edit2, Trash2, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from '@/components/ui/checkbox';

// Mock addresses data
const mockUserAddresses: Address[] = [
  { id: 'addr1', street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA', isDefault: true },
  { id: 'addr2', street: '456 Oak Ave', city: 'Otherville', state: 'NY', zipCode: '10001', country: 'USA', isDefault: false },
];

const addressSchema = z.object({
  street: z.string().min(3, "Street address is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  zipCode: z.string().min(5, "Valid ZIP code is required."),
  country: z.string().min(2, "Country is required."),
  isDefault: z.boolean().optional(),
});

export default function ManageAddresses() {
  const { user, login: updateUser } = useAuthStore(); // Use login to update user state for simplicity
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      street: "", city: "", state: "", zipCode: "", country: "USA", isDefault: false,
    },
  });

  useEffect(() => {
    if (user) {
      // In a real app, user.addresses would come from the store/API
      const userAddresses = user.addresses || mockUserAddresses;
      setAddresses(userAddresses);
      setIsLoading(false);
    } else {
        setIsLoading(false);
    }
  }, [user]);
  
  useEffect(() => {
    if (editingAddress) {
      form.reset(editingAddress);
    } else {
      form.reset({ street: "", city: "", state: "", zipCode: "", country: "USA", isDefault: false });
    }
  }, [editingAddress, form, isDialogOpen]);


  const handleAddOrUpdateAddress = (values: z.infer<typeof addressSchema>) => {
    let updatedAddresses;
    if (editingAddress) {
      // Update existing address
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? { ...addr, ...values } : addr
      );
    } else {
      // Add new address
      const newAddress: Address = { ...values, id: `addr-${Date.now()}` };
      updatedAddresses = [...addresses, newAddress];
    }
    
    // Handle default address logic
    if (values.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: addr.id === (editingAddress?.id || updatedAddresses[updatedAddresses.length-1].id) }));
    }

    setAddresses(updatedAddresses);
    // Persist to user state (mocked)
    if (user) {
        updateUser({ ...user, addresses: updatedAddresses });
    }
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (addressId: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    setAddresses(updatedAddresses);
     if (user) {
        updateUser({ ...user, addresses: updatedAddresses });
    }
  };
  
  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };


  if (isLoading) {
    return <p>Loading addresses...</p>;
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <div>
                <CardHeader className="p-0">
                    <CardTitle className="text-2xl">My Addresses</CardTitle>
                    <CardDescription>Manage your saved delivery locations.</CardDescription>
                </CardHeader>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button onClick={openAddDialog} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Address
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
                    <DialogDescription>
                        {editingAddress ? "Update your delivery address details." : "Enter the details for your new delivery address."}
                    </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddOrUpdateAddress)} className="space-y-4 py-4">
                         <FormField control={form.control} name="street" render={({ field }) => (
                            <FormItem><FormLabel>Street</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                         )} />
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="state" render={({ field }) => (
                                <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="zipCode" render={({ field }) => (
                                <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="country" render={({ field }) => (
                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                         </div>
                         <FormField control={form.control} name="isDefault" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Set as default address</FormLabel>
                                </div>
                            </FormItem>
                         )} />
                        <DialogFooter>
                            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">{editingAddress ? "Save Changes" : "Add Address"}</Button>
                        </DialogFooter>
                    </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>

      {addresses.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">You have no saved addresses. Add one to get started!</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <Card key={address.id} className={`shadow-sm hover:shadow-md transition-shadow ${address.isDefault ? 'border-primary border-2' : ''}`}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary"/>
                            {address.street}
                        </p>
                        <p className="text-sm text-muted-foreground">{address.city}, {address.state} {address.zipCode}</p>
                        <p className="text-sm text-muted-foreground">{address.country}</p>
                        {address.isDefault && <Badge className="mt-2 bg-primary/20 text-primary border-primary hover:bg-primary/30">Default</Badge>}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(address)}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address.id)} className="text-destructive hover:text-destructive/80">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
