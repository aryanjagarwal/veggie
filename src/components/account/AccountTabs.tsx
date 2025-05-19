"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter } from "next/navigation";
import { UserCircle2, ListOrdered, MapPin } from "lucide-react";

export default function AccountTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { value: "/account", label: "Profile", icon: <UserCircle2 className="mr-2 h-4 w-4" /> },
    { value: "/account/orders", label: "My Orders", icon: <ListOrdered className="mr-2 h-4 w-4" /> },
    { value: "/account/addresses", label: "My Addresses", icon: <MapPin className="mr-2 h-4 w-4" /> },
  ];

  const getCurrentTab = () => {
    // Find the longest matching path for nested routes
    let currentTab = "/account";
    for (const tab of tabs) {
        if (pathname.startsWith(tab.value) && tab.value.length > currentTab.length ) {
            if (pathname === tab.value || pathname.startsWith(tab.value + "/")) {
                 currentTab = tab.value;
            }
        }
    }
     if (pathname === "/account") return "/account"; // Ensure base /account matches
    return currentTab;
  };


  return (
    <Tabs value={getCurrentTab()} onValueChange={(value) => router.push(value)} className="mb-6">
      <TabsList className="grid w-full grid-cols-3">
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
