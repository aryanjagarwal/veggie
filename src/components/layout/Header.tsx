"use client";

import Link from 'next/link';
import AppLogo from '@/components/layout/AppLogo';
import CartIcon from '@/components/cart/CartIcon';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { UserCircle2, LogOut, LogIn, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'VG';
  };

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <AppLogo />
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
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
              <Button variant="ghost" asChild>
                <Link href="/login" className="flex items-center">
                  <LogIn className="mr-1 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                <Link href="/signup" className="flex items-center">
                  <UserPlus className="mr-1 h-4 w-4" /> Sign Up
                </Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
