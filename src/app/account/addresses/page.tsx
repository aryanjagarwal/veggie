
import ManageAddresses from '@/components/account/ManageAddresses';
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountAddressesPage() {
  return (
    <div>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl">My Addresses</CardTitle>
        <CardDescription>Manage your saved shipping addresses.</CardDescription>
      </CardHeader>
      <ManageAddresses />
    </div>
  );
}
