"use client";
import type { ReactNode } from 'react';
import AccountTabs from '@/components/account/AccountTabs';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AccountLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isAuthenticated) {
      router.push('/login?redirect=/account');
    }
  }, [isAuthenticated, router]);

  if (!isClient || !isAuthenticated) {
    return <div className="text-center py-10">Loading account information...</div>; // Or a loading spinner
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8"> {/* Simplified to single column for tabs + content */}
        <div>
          <AccountTabs />
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
