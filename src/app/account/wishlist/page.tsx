
"use client";

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { sampleProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import ProductList from '@/components/products/ProductList';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartCrack } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WishlistPage() {
  const { user, isAuthenticated } = useAuthStore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.wishlist) {
      const userWishlistIds = user.wishlist;
      const products = sampleProducts.filter(p => userWishlistIds.includes(p.id));
      setWishlistProducts(products);
    } else {
      setWishlistProducts([]);
    }
    setIsLoading(false);
  }, [user, isAuthenticated]);

  if (isLoading) {
    return <p>Loading your wishlist...</p>;
  }

  if (!isAuthenticated) {
    // This should ideally be handled by the AccountLayout redirecting to login
    return (
        <div className="text-center py-10">
            <p>Please log in to view your wishlist.</p>
            <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href="/login?redirect=/account/wishlist">Login</Link>
            </Button>
        </div>
    );
  }

  return (
    <div>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl">My Wishlist</CardTitle>
        <CardDescription>Products you've saved for later.</CardDescription>
      </CardHeader>
      {wishlistProducts.length > 0 ? (
        <ProductList products={wishlistProducts} />
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
          <HeartCrack className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven&apos;t added any favorites yet. Start browsing!
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/">Discover Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
