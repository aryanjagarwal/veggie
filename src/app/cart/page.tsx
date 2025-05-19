import CartDisplay from '@/components/cart/CartDisplay';

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-8 text-center">Your Cart</h1>
      <CartDisplay />
    </div>
  );
}
