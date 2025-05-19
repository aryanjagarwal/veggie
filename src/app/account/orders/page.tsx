import OrderHistory from '@/components/account/OrderHistory';
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


export default function AccountOrdersPage() {
  return (
    <div>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl">My Orders</CardTitle>
        <CardDescription>Track your past and current orders.</CardDescription>
      </CardHeader>
      <OrderHistory />
    </div>
  );
}
