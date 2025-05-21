
export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description?: string;
  dataAiHint?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

// User type is simplified as Clerk manages user data.
// Custom fields like addresses or wishlist would typically be stored
// in your own database and linked to the Clerk user ID.
export type User = {
  id: string; // Clerk User ID
  email?: string | null; // From Clerk
  name?: string | null; // fullName from Clerk
  imageUrl?: string | null; // From Clerk
  // addresses?: Address[]; // Removed for initial Clerk integration
  // wishlist?: string[]; // Removed for initial Clerk integration
};

export type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
};

export type Order = {
  id:string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Address; // This would need to be captured at checkout
  deliveryTimeSlot: string;
  orderDate: Date;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
};

export type TimeSlot = {
  id: string;
  label: string; // e.g., "9:00 AM - 11:00 AM"
  date: string; // e.g., "2024-07-30"
};
