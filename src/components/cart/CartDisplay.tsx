"use client";

import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import { MinusCircle, PlusCircle, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import RecommendedProducts from './RecommendedProducts';

export default function CartDisplay() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Your Shopping Cart</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Product</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Remove</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(item => (
                  <TableRow key={item.product.id}>
                    <TableCell>
                      <Image 
                        src={item.product.imageUrl} 
                        alt={item.product.name} 
                        width={64} 
                        height={64} 
                        className="rounded-md object-cover"
                        data-ai-hint={item.product.dataAiHint || 'product image'}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">{item.product.category}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <MinusCircle className="h-5 w-5" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                          <PlusCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${item.product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${(item.product.price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.product.id)} className="text-destructive hover:text-destructive/80">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={clearCart}>
              Clear Cart
            </Button>
          </CardFooter>
        </Card>
        <RecommendedProducts />
      </div>
    </div>
  );
}
