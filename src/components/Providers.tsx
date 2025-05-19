"use client";

import type { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";

// This component can be expanded to include other providers like React Query, ThemeProvider, etc.
export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
