
"use client";

import Link from 'next/link';
import AppLogo from '@/components/layout/AppLogo';
import CartIcon from '@/components/cart/CartIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs"; // Import useClerk
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { signOut } = useClerk(); // Get signOut function

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
            <Link href="/account">
              <Button variant="ghost" className="hidden sm:inline-flex">Account</Button>
            </Link>
            <Button 
              variant="ghost" 
              onClick={() => signOut({ redirectUrl: '/' })}
              className="hidden sm:inline-flex"
            >
              Sign Out
            </Button>
             {/* Minimal display for mobile when signed in, can be expanded if needed */}
            <div className="sm:hidden">
                <Link href="/account">
                    <Button variant="ghost" size="sm">Account</Button>
                </Link>
            </div>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost" className="hidden sm:inline-flex">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 hidden sm:inline-flex">Sign Up</Button>
            </Link>
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
          <SignedIn>
            {/* Mobile Sign Out Button - UserButton is removed, so we need an explicit sign out */}
            <div className="flex gap-2 mt-2 sm:hidden">
                <Link href="/account" className="flex-1">
                    <Button variant="outline" className="w-full">Account</Button>
                </Link>
                <Button 
                    variant="outline" 
                    onClick={() => signOut({ redirectUrl: '/' })}
                    className="flex-1"
                >
                    Sign Out
                </Button>
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex gap-2 mt-2 sm:hidden">
              <Link href="/sign-in" className="flex-1">
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <Link href="/sign-up" className="flex-1">
                <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 w-full">Sign Up</Button>
              </Link>
            </div>
          </SignedOut>
      </div>
    </header>
  );
}
