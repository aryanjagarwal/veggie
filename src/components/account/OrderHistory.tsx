
"use client";

import { useEffect, useState } from 'react';
import type { Order } from '@/lib/types';
import { useAuthStore } from '@/lib/store';
import { mockOrders } from '@/lib/orders'; // Import from new location
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import Link from 'next/link';
import { Eye } from 'lucide-react';

export default function OrderHistory() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // In a real app, fetch orders associated with user.id
      // For now, using the imported mockOrders
      setTimeout(() => { 
        setOrders(mockOrders);
        setIsLoading(false);
      }, 500); // Shorter delay for mock
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <p>Loading order history...</p>;
  }

  if (orders.length === 0 && !isLoading) {
    return <p>You have no past orders.</p>;
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
    <Table>
      <TableCaption>A list of your recent orders. Click "View" for details.</TableCaption>
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
              <Badge 
                variant={getStatusBadgeVariant(order.status)}
                className={order.status === 'Delivered' ? 'bg-green-600 hover:bg-green-700 text-white' : 
                           order.status === 'Shipped' ? 'bg-blue-500 hover:bg-blue-600 text-white' :
                           order.status === 'Processing' ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}
              >
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/account/orders/${order.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> View
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
