import { Leaf } from 'lucide-react';
import Link from 'next/link';

export default function AppLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
      <Leaf size={32} />
      <span className="text-2xl font-bold text-primary">VeggieGo</span>
    </Link>
  );
}
