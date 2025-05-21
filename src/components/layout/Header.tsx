
"use client";

import Link from 'next/link';
import AppLogo from '@/components/layout/AppLogo';
import CartIcon from '@/components/cart/CartIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UserButton, SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      router.push(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`);
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <AppLogo />
        <nav className="flex items-center gap-2 md:gap-4 flex-grow justify-end">
          <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center flex-grow max-w-xs lg:max-w-sm ml-4">
            <Input 
              type="search" 
              placeholder="Search products..." 
              className="pr-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/">Products</Link>
          </Button>
          <CartIcon />
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="hidden sm:inline-flex">Login</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 hidden sm:inline-flex">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
        </nav>
      </div>
       <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <Input 
              type="search" 
              placeholder="Search products..." 
              className="pr-10 w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <SignedOut>
            <div className="flex gap-2 mt-2 sm:hidden">
              <SignInButton mode="modal">
                <Button variant="outline" className="flex-1">Login</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1">Sign Up</Button>
              </SignUpButton>
            </div>
          </SignedOut>
      </div>
    </header>
  );
}
