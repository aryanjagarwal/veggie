
"use client";

import { useParams, notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { mockOrders } from '@/lib/orders';
import type { Order, CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ArrowLeft, Package, MapPin, CalendarDays, ListOrdered } from 'lucide-react';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const order: Order | undefined = mockOrders.find(o => o.id === orderId);

  if (!order) {
    notFound();
  }

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'default';
      case 'Shipped': return 'secondary';
      case 'Processing': return 'outline';
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="inline-flex items-center text-primary hover:underline px-0 hover:bg-transparent mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to My Orders
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Order Details
              </CardTitle>
              <CardDescription>Order ID: #{order.id.substring(order.id.length - 6)}</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground space-y-1 sm:text-right">
                <p>Date: {format(new Date(order.orderDate), 'PPP p')}</p>
                <Badge 
                  variant={getStatusBadgeVariant(order.status)}
                  className={`text-sm ${order.status === 'Delivered' ? 'bg-green-600 hover:bg-green-700 text-white' : 
                             order.status === 'Shipped' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                             order.status === 'Processing' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}`}
                >
                  Status: {order.status}
                </Badge>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><ListOrdered className="h-5 w-5 text-primary" />Items Ordered</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item: CartItem) => (
                  <TableRow key={item.product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover aspect-square"
                        data-ai-hint={item.product.dataAiHint || 'product image'}
                      />
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">{item.product.category}</p>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${(item.product.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary" />Shipping Address</h3>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" />Delivery Slot</h3>
              <p className="text-sm text-muted-foreground">{order.deliveryTimeSlot}</p>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="p-6 bg-muted/50 rounded-b-lg">
          <div className="w-full space-y-1 text-right">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal (from items above):</span>
              <span>${order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Shipping & Handling:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-foreground pt-1 border-t border-border mt-1">
              <span>Grand Total:</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
