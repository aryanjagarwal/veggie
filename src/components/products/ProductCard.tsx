
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCartStore, useAuthStore } from '@/lib/store';
import { ShoppingCart, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem: addItemToCart } = useCartStore();
  const { user, isAuthenticated, addToWishlist, removeFromWishlist } = useAuthStore();

  const isInWishlist = isAuthenticated && user?.wishlist?.includes(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking heart
    e.stopPropagation(); // Prevent event bubbling to parent Link
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }
    if (isInWishlist) {
      removeFromWishlist(product.id);
      toast({ title: `${product.name} removed from wishlist.` });
    } else {
      addToWishlist(product.id);
      toast({ title: `${product.name} added to wishlist!` });
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group">
      <div className="relative"> {/* Container for image and wishlist button */}
        <Link href={`/products/${product.id}`} passHref legacyBehavior>
          <a className="block cursor-pointer">
            <CardHeader className="p-0">
              <div className="aspect-square relative w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  data-ai-hint={product.dataAiHint || 'product image'}
                />
              </div>
            </CardHeader>
          </a>
        </Link>
        <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/70 hover:bg-background/90 rounded-full text-primary"
            onClick={handleWishlistToggle}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
            <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-primary stroke-primary' : 'stroke-primary'}`} />
        </Button>
      </div>
      
      <Link href={`/products/${product.id}`} passHref legacyBehavior>
        <a className="block cursor-pointer flex flex-col flex-grow">
          <CardContent className="p-4 flex-grow">
            <CardTitle className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">{product.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-2">{product.category}</CardDescription>
            <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
            {product.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2 flex-grow">{product.description}</p>}
          </CardContent>
        </a>
      </Link>
      <CardFooter className="p-4 border-t mt-auto">
        <Button
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={() => addItemToCart(product)}
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
