"use client";

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function CartIcon() {
  const { getItemCount } = useCartStore();
  const [count, setCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Subscribe to cart changes to update count
    const unsubscribe = useCartStore.subscribe(
      (state) => setCount(state.getItemCount())
    );
    // Initial count
    setCount(getItemCount());
    return () => unsubscribe();
  }, [getItemCount]);

  if (!isClient) {
    // Render a placeholder or nothing on the server to avoid hydration mismatch
    return (
      <Button variant="ghost" size="icon" asChild aria-label="Shopping cart">
        <Link href="/cart">
          <ShoppingCart />
        </Link>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" asChild className="relative" aria-label={`Shopping cart with ${count} items`}>
      <Link href="/cart">
        <ShoppingCart />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {count}
          </span>
        )}
      </Link>
    </Button>
  );
}
