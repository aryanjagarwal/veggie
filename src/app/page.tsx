import ProductList from '@/components/products/ProductList';
import { sampleProducts } from '@/lib/products'; // Using sample data

export default function HomePage() {
  // In a real app, fetch products from an API
  const products = sampleProducts;

  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-gradient-to-r from-primary/20 via-background to-accent/10 rounded-lg shadow">
        <h1 className="text-4xl font-bold text-primary mb-2">Welcome to VeggieGo!</h1>
        <p className="text-lg text-foreground">Your one-stop shop for the freshest fruits and vegetables, delivered right to your door.</p>
      </section>
      
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center sm:text-left">Our Fresh Selection</h2>
        <ProductList products={products} />
      </section>
    </div>
  );
}
