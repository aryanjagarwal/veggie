
"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

export default function AccountProfilePage() {
  const { user, isLoaded } = useUser();
  const { updateUser } = useClerk(); 
  const [editedName, setEditedName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedName(user.fullName || "");
    }
  }, [user]);

  if (!isLoaded || !user) {
    return <p>Loading user profile...</p>; 
  }
  
  const getUserInitials = () => {
    if (user?.fullName) return user.fullName.split(' ').map(n => n[0]).join('').toUpperCase();
    if (user?.primaryEmailAddress?.emailAddress) return user.primaryEmailAddress.emailAddress[0].toUpperCase();
    return 'VG';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Clerk's user.fullName is a concatenation of firstName and lastName.
    // We'll update firstName for simplicity, or you might want separate fields.
    // For this example, we assume editedName is the full name and try to split it.
    const nameParts = editedName.trim().split(' ');
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(' ') || "";

    if (firstName !== (user.firstName || "") || lastName !== (user.lastName || "")) {
      setIsLoading(true);
      try {
        await updateUser({ firstName, lastName });
        toast({ title: "Profile name updated successfully!"});
      } catch (error) {
        console.error("Error updating profile:", error);
        toast({ title: "Failed to update profile.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({ title: "No changes to save.", variant: "default" });
    }
  };
  
  const currentName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user.lastName || "");

  return (
    <div>
      <CardHeader className="p-0 mb-6">
        <CardTitle className="text-2xl">Profile Information</CardTitle>
        <CardDescription>View and manage your personal details.</CardDescription>
      </CardHeader>
      
      <div className="flex items-center gap-4 mb-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.imageUrl || `https://placehold.co/100x100.png?text=${getUserInitials()}`} alt={user.fullName || user.primaryEmailAddress?.emailAddress} data-ai-hint="profile avatar" />
           <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
        </Avatar>
        <div>
            <h3 className="text-xl font-semibold">{user.fullName || "VeggieGo User"}</h3>
            <p className="text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
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
            disabled={isLoading}
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={user.primaryEmailAddress?.emailAddress || ''} disabled />
        </div>
        <Button 
          type="submit" 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={isLoading || editedName === currentName}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
