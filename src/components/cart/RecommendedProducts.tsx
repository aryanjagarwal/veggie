"use client";

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { recommendComplementaryProducts, type RecommendComplementaryProductsOutput } from '@/ai/flows/recommend-complementary-products';
import { useCartStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';
import { sampleProducts } from '@/lib/products'; // To find product details

export default function RecommendedProducts() {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastAddedItem = useCartStore(state => state.lastAddedItem);
  const addItemToCart = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (lastAddedItem) {
        setIsLoading(true);
        setRecommendations([]); // Clear previous recommendations
        try {
          const result: RecommendComplementaryProductsOutput = await recommendComplementaryProducts({
            productName: lastAddedItem.name,
            productCategory: lastAddedItem.category,
          });
          // Filter out the item itself from recommendations
          setRecommendations(result.complementaryProducts.filter(name => name.toLowerCase() !== lastAddedItem.name.toLowerCase()).slice(0, 3));
        } catch (error) {
          console.error("Error fetching recommendations:", error);
          setRecommendations([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setRecommendations([]);
      }
    };

    fetchRecommendations();
  }, [lastAddedItem]);

  const findProductByName = (name: string): Product | undefined => {
    return sampleProducts.find(p => p.name.toLowerCase() === name.toLowerCase());
  };

  if (!lastAddedItem && recommendations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="mt-8 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb className="text-accent" />
          You Might Also Like
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-muted-foreground">Finding recommendations...</p>}
        {!isLoading && recommendations.length === 0 && lastAddedItem && (
          <p className="text-muted-foreground">No specific recommendations found for {lastAddedItem.name}. Explore more products!</p>
        )}
        {!isLoading && recommendations.length > 0 && (
          <ul className="space-y-2">
            {recommendations.map((recName, index) => {
              const recommendedProduct = findProductByName(recName);
              if (recommendedProduct) {
                return (
                <li key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-secondary transition-colors">
                  <span>{recommendedProduct.name} (${recommendedProduct.price.toFixed(2)})</span>
                  <Button size="sm" variant="outline" onClick={() => addItemToCart(recommendedProduct)}>
                    Add
                  </Button>
                </li>
                );
              }
              return (
                <li key={index} className="p-2 rounded-md text-muted-foreground">
                  {recName} (details unavailable)
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
