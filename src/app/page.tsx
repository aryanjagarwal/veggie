
import ProductList from '@/components/products/ProductList';
import { sampleProducts } from '@/lib/products'; // Using sample data
import type { Product } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Truck, Smile, ShoppingBasket } from 'lucide-react';

export default function HomePage() {
  // In a real app, fetch products from an API
  const allProducts = sampleProducts;

  // Select a few products for "Today's Top Picks"
  // For demonstration, let's pick the first 4. In a real app, this could be curated.
  const featuredProducts: Product[] = allProducts.slice(0, 4);

  const whyChooseUsItems = [
    {
      icon: <Leaf className="h-10 w-10 text-primary mb-3" />,
      title: 'Farm Fresh Quality',
      description: 'We source the freshest produce directly, ensuring top quality and taste.',
    },
    {
      icon: <Truck className="h-10 w-10 text-primary mb-3" />,
      title: 'Speedy Delivery',
      description: 'Get your groceries delivered to your doorstep quickly and reliably.',
    },
    {
      icon: <ShoppingBasket className="h-10 w-10 text-primary mb-3" />,
      title: 'Wide Selection',
      description: 'Explore a diverse range of fruits, vegetables, and seasonal specialties.',
    },
     {
      icon: <Smile className="h-10 w-10 text-primary mb-3" />,
      title: 'Loved by Customers',
      description: 'Join thousands of happy customers enjoying fresh produce every day.',
    },
  ];

  return (
    <div className="space-y-12">
      <section className="text-center py-10 bg-gradient-to-r from-primary/20 via-background to-accent/10 rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-3">Welcome to VeggieGo!</h1>
        <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">Your one-stop shop for the freshest fruits and vegetables, delivered right to your door.</p>
      </section>
      
      {featuredProducts.length > 0 && (
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-center sm:text-left">Today's Top Picks</h2>
          <ProductList products={featuredProducts} />
        </section>
      )}

      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center">Why Choose VeggieGo?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUsItems.map((item, index) => (
            <Card key={index} className="text-center shadow-md hover:shadow-lg transition-shadow bg-card">
              <CardHeader className="items-center">
                {item.icon}
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center sm:text-left">Explore Our Full Range</h2>
        <ProductList products={allProducts} />
      </section>
    </div>
  );
}
