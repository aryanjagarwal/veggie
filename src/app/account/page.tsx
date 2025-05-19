
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useAuthStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AccountProfilePage() {
  const { user, updateUserProfile } = useAuthStore();
  const [editedName, setEditedName] = useState<string>("");

  useEffect(() => {
    if (user) {
      setEditedName(user.name || "");
    }
  }, [user]);

  if (!user) {
    return <p>Loading user profile...</p>; 
  }
  
  const getUserInitials = () => {
    if (user?.name) return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'VG';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      // Only call updateUserProfile if the name has actually changed
      if (editedName !== (user.name || "")) {
        updateUserProfile({ name: editedName });
        // The store's updateUserProfile will show a generic toast.
        // We can show a more specific one here if needed, or rely on the store's.
        // For now, the store's toast for name change is good.
        toast({ title: "Profile name updated successfully!"});

      } else {
        toast({ title: "No changes to save.", variant: "default" });
      }
    }
  };

  return (
    <div>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl">Profile Information</CardTitle>
        <CardDescription>View and manage your personal details.</CardDescription>
      </CardHeader>
      
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.imageUrl || `https://placehold.co/100x100.png?text=${getUserInitials()}`} alt={user.name || user.email} data-ai-hint="profile avatar" />
           <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
        </Avatar>
        <div>
            <h3 className="text-xl font-semibold">{user.name || "VeggieGo User"}</h3>
            <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            value={editedName} 
            onChange={(e) => setEditedName(e.target.value)} 
            placeholder="Your full name" 
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={user.email} disabled />
        </div>
        <Button 
          type="submit" 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={editedName === (user.name || "")} // Disable if no changes
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
