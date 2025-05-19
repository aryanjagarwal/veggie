
"use client";

import Link from 'next/link';
import AppLogo from '@/components/layout/AppLogo';
import CartIcon from '@/components/cart/CartIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store';
import { UserCircle2, LogOut, LogIn, UserPlus, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'VG';
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      // For now, we'll just log it. Actual search page implementation is next.
      console.log("Search term:", searchTerm.trim());
      // Potentially clear search term after submission or keep it
      // setSearchTerm(''); 
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
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.imageUrl || `https://placehold.co/100x100.png?text=${getUserInitials()}`} alt={user.name || user.email} data-ai-hint="profile avatar" />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name || "VeggieGo User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center">
                    <UserCircle2 className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild className="hidden sm:inline-flex">
                <Link href="/login" className="flex items-center">
                  <LogIn className="mr-1 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90 hidden sm:inline-flex" asChild>
                <Link href="/signup" className="flex items-center">
                  <UserPlus className="mr-1 h-4 w-4" /> Sign Up
                </Link>
              </Button>
              {/* Mobile only Login/Signup icons if needed or rely on dropdown */}
            </>
          )}
        </nav>
      </div>
       {/* Search bar for mobile, shown below the main header content for better layout */}
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
      </div>
    </header>
  );
}
