
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/lib/store";
import { useAuth, useUser } from "@clerk/nextjs"; // Using Clerk hooks
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import type { TimeSlot } from "@/lib/types";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  streetAddress: z.string().min(5, "Street address is required."),
  city: z.string().min(2, "City is required."),
  zipCode: z.string().min(5, "Valid ZIP code is required."),
  country: z.string().min(2, "Country is required."),
  deliveryTimeSlot: z.string().min(1, "Please select a delivery time slot."),
});

const availableTimeSlots: TimeSlot[] = [
  { id: 'ts1', label: 'Today, 2:00 PM - 4:00 PM', date: new Date().toISOString().split('T')[0] },
  { id: 'ts2', label: 'Tomorrow, 10:00 AM - 12:00 PM', date: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
  { id: 'ts3', label: 'Tomorrow, 4:00 PM - 6:00 PM', date: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "", // Will be populated by effect below
      streetAddress: "", // Address management removed, so these will be empty or user types them
      city: "",
      zipCode: "",
      country: "USA",
      deliveryTimeSlot: "",
    },
  });
  
  useEffect(() => {
    if (isClient && isAuthLoaded && !isSignedIn) {
      // Middleware should handle this, but as a fallback:
      toast({ title: "Please login to checkout.", variant: "destructive" });
      router.push("/"); // Redirect to Clerk's sign-in or home
    }
    if (isClient && items.length === 0) {
      toast({ title: "Your cart is empty!", description: "Please add items before checking out.", variant: "destructive" });
      router.push("/cart");
    }
    if (user && isUserLoaded) {
      form.reset({
        fullName: user.fullName || "",
        // Addresses are not part of default Clerk user object. User needs to fill these.
        streetAddress: form.getValues().streetAddress || "", 
        city: form.getValues().city || "",
        zipCode: form.getValues().zipCode || "",
        country: form.getValues().country || "USA",
        deliveryTimeSlot: form.getValues().deliveryTimeSlot || "",
      });
    }
  }, [isClient, items, isSignedIn, isAuthLoaded, user, isUserLoaded, router, form]);


  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    // Mock order placement
    console.log("Order placed:", {
      customer: values,
      clerkUserId: user?.id, // Include Clerk user ID
      items,
      total: getCartTotal(),
    });
    toast({
      title: "Order Placed Successfully!",
      description: "Thank you for your purchase. We'll notify you once it's shipped.",
    });
    clearCart();
    router.push("/account/orders"); 
  }

  if (!isClient || !isAuthLoaded || !isUserLoaded) {
    return <div className="text-center py-10">Loading checkout...</div>;
  }

  if (!isSignedIn && isClient) {
     // Should be redirected by useEffect or middleware
    return <div className="text-center py-10">Redirecting...</div>;
  }
  
  if (items.length === 0 && isClient) {
    // Should be redirected by useEffect
    return <div className="text-center py-10">Your cart is empty. Redirecting...</div>;
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold">Delivery Address</h2>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
                <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                    <Input placeholder="Anytown" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
                <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                    <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                    <Input placeholder="USA" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <h2 className="text-2xl font-semibold pt-4">Delivery Time Slot</h2>
        <FormField
          control={form.control}
          name="deliveryTimeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose a Time Slot</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a delivery time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableTimeSlots.map(slot => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center text-xl font-semibold mb-4">
                <span>Order Total:</span>
                <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6">
                Place Order
            </Button>
        </div>
      </form>
    </Form>
  );
}
