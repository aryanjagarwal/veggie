"use client";

import { useEffect, useState } from 'react';
import type { Order } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'order123',
    items: [
      { product: { id: '1', name: 'Fresh Apples', price: 2.99, category: 'Fruits', imageUrl: 'https://placehold.co/40x40.png' }, quantity: 2 },
      { product: { id: '3', name: 'Crisp Carrots', price: 0.99, category: 'Vegetables', imageUrl: 'https://placehold.co/40x40.png' }, quantity: 5 },
    ],
    totalAmount: (2.99 * 2) + (0.99 * 5),
    shippingAddress: { id: 'addr1', street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA' },
    deliveryTimeSlot: 'Today, 2:00 PM - 4:00 PM',
    orderDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
    status: 'Delivered',
  },
  {
    id: 'order456',
    items: [
      { product: { id: '5', name: 'Leafy Spinach', price: 2.49, category: 'Vegetables', imageUrl: 'https://placehold.co/40x40.png' }, quantity: 1 },
    ],
    totalAmount: 2.49,
    shippingAddress: { id: 'addr1', street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA' },
    deliveryTimeSlot: 'Tomorrow, 10:00 AM - 12:00 PM',
    orderDate: new Date(Date.now() - 86400000), // 1 day ago
    status: 'Shipped',
  },
];


export default function OrderHistory() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching orders for the logged-in user
    if (user) {
      // In a real app, fetch orders associated with user.id
      setTimeout(() => { // Simulate API delay
        setOrders(mockOrders);
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <p>Loading order history...</p>;
  }

  if (orders.length === 0) {
    return <p>You have no past orders.</p>;
  }

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Delivered': return 'default'; // Greenish if customized, default is primary
      case 'Shipped': return 'secondary'; // Bluish/Grayish
      case 'Processing': return 'outline'; // Orangeish if customized, default is outline
      case 'Pending': return 'outline';
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <Table>
      <TableCaption>A list of your recent orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">#{order.id.substring(order.id.length - 6)}</TableCell>
            <TableCell>{format(new Date(order.orderDate), 'PPP')}</TableCell>
            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              {/* <Button variant="link" size="sm">View Details</Button> */}
              {/* In a real app, link to an order details page */}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
