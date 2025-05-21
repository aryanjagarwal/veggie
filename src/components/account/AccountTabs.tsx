
"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { UserCircle2, ListOrdered, MapPin } from "lucide-react"; // Added MapPin

export default function AccountTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { value: "/account", label: "Profile", icon: <UserCircle2 className="mr-2 h-4 w-4" /> },
    { value: "/account/orders", label: "My Orders", icon: <ListOrdered className="mr-2 h-4 w-4" /> },
    { value: "/account/addresses", label: "My Addresses", icon: <MapPin className="mr-2 h-4 w-4" /> },
  ];

  const getCurrentTab = () => {
    let currentTab = "/account"; 
    const exactMatch = tabs.find(tab => tab.value === pathname);
    if (exactMatch) return exactMatch.value;

    for (const tab of tabs) {
        // Ensure that /account/orders doesn't incorrectly match /account for currentTab determination
        if (pathname.startsWith(tab.value) && tab.value.length >= currentTab.length ) {
             if (tab.value === "/account" && pathname !== "/account") continue; // Skip if base /account is matched but path is more specific
             currentTab = tab.value;
        }
    }
     // If after checks, currentTab is still /account but pathname is something like /account/orders/some-order-id
    // it means we are on a sub-page of a tab, so we find the base tab.
    const baseTab = tabs.find(tab => pathname.startsWith(tab.value) && tab.value !== "/account");
    if (baseTab) return baseTab.value;
    
    if (pathname === "/account" || (pathname.startsWith("/account/") && currentTab === "/account" && !baseTab)) {
      return "/account";
    }

    return currentTab;
  };

  return (
    <Tabs value={getCurrentTab()} onValueChange={(value) => router.push(value)} className="mb-6">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3"> {/* Adjusted for three tabs */}
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
