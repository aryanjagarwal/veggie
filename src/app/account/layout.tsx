
"use client";
import type { ReactNode } from 'react';
import AccountTabs from '@/components/account/AccountTabs';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/'); // Redirect to home if not signed in after Clerk is loaded
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) {
    return <div className="text-center py-10">Loading account information...</div>;
  }

  if (!isSignedIn) {
     // This case should ideally be handled by middleware or redirect,
     // but as a fallback:
    return <div className="text-center py-10">Please sign in to view your account.</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
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
