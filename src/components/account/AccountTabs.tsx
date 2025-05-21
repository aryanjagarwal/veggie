
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { UserCircle2, ListOrdered } from "lucide-react"; // Removed MapPin, Heart

export default function AccountTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { value: "/account", label: "Profile", icon: <UserCircle2 className="mr-2 h-4 w-4" /> },
    { value: "/account/orders", label: "My Orders", icon: <ListOrdered className="mr-2 h-4 w-4" /> },
    // { value: "/account/addresses", label: "My Addresses", icon: <MapPin className="mr-2 h-4 w-4" /> }, // Removed
    // { value: "/account/wishlist", label: "Wishlist", icon: <Heart className="mr-2 h-4 w-4" /> }, // Removed
  ];

  const getCurrentTab = () => {
    let currentTab = "/account"; 
    const exactMatch = tabs.find(tab => tab.value === pathname);
    if (exactMatch) return exactMatch.value;

    for (const tab of tabs) {
        if (pathname.startsWith(tab.value) && tab.value.length > currentTab.length ) {
             currentTab = tab.value;
        }
    }
    if (pathname === "/account" || (pathname.startsWith("/account/") && currentTab === "/account")) {
      return "/account";
    }
    return currentTab;
  };

  return (
    <Tabs value={getCurrentTab()} onValueChange={(value) => router.push(value)} className="mb-6">
      <TabsList className="grid w-full grid-cols-2"> {/* Adjusted for fewer tabs */}
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} className="flex items-center">
            {tab.icon}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
