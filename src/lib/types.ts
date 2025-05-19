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

export type User = {
  id: string;
  email: string;
  name?: string;
  addresses?: Address[];
  wishlist?: string[]; // Added wishlist
  imageUrl?: string; // Added for consistency with account page
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
  shippingAddress: Address;
  deliveryTimeSlot: string;
  orderDate: Date;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
};

export type TimeSlot = {
  id: string;
  label: string; // e.g., "9:00 AM - 11:00 AM"
  date: string; // e.g., "2024-07-30"
};
