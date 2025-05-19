import type { Product } from '@/lib/types';

export const sampleProducts: Product[] = [
  { 
    id: '1', 
    name: 'Fresh Apples', 
    price: 2.99, 
    category: 'Fruits', 
    imageUrl: 'https://placehold.co/300x300/90EE90/000000.png', 
    description: 'Crisp and juicy apples, perfect for snacking or baking.',
    dataAiHint: 'apple fruit'
  },
  { 
    id: '2', 
    name: 'Organic Bananas', 
    price: 1.99, 
    category: 'Fruits', 
    imageUrl: 'https://placehold.co/300x300/FFD700/000000.png', 
    description: 'Naturally sweet and potassium-rich organic bananas.',
    dataAiHint: 'banana fruit'
  },
  { 
    id: '3', 
    name: 'Crisp Carrots', 
    price: 0.99, 
    category: 'Vegetables', 
    imageUrl: 'https://placehold.co/300x300/FFA500/000000.png', 
    description: 'Crunchy carrots, great for salads, roasting, or juicing.',
    dataAiHint: 'carrot vegetable'
  },
  { 
    id: '4', 
    name: 'Ripe Tomatoes', 
    price: 3.49, 
    category: 'Vegetables', // Botanically a fruit, culinarily a vegetable
    imageUrl: 'https://placehold.co/300x300/FF6347/FFFFFF.png', 
    description: 'Plump and flavorful tomatoes, ideal for sauces and salads.',
    dataAiHint: 'tomato vegetable'
  },
  { 
    id: '5', 
    name: 'Leafy Spinach', 
    price: 2.49, 
    category: 'Vegetables', 
    imageUrl: 'https://placehold.co/300x300/32CD32/FFFFFF.png', 
    description: 'Tender spinach leaves, packed with nutrients.',
    dataAiHint: 'spinach greens'
  },
  { 
    id: '6', 
    name: 'Sweet Strawberries', 
    price: 4.99, 
    category: 'Fruits', 
    imageUrl: 'https://placehold.co/300x300/FF69B4/FFFFFF.png', 
    description: 'Juicy and sweet strawberries, perfect for desserts or on their own.',
    dataAiHint: 'strawberry fruit'
  },
  { 
    id: '7', 
    name: 'Broccoli Florets', 
    price: 2.79, 
    category: 'Vegetables', 
    imageUrl: 'https://placehold.co/300x300/228B22/FFFFFF.png', 
    description: 'Fresh broccoli florets, versatile for steaming, roasting, or stir-frying.',
    dataAiHint: 'broccoli vegetable'
  },
  { 
    id: '8', 
    name: 'Juicy Oranges', 
    price: 3.29, 
    category: 'Fruits', 
    imageUrl: 'https://placehold.co/300x300/FF8C00/000000.png', 
    description: 'Sweet and tangy oranges, bursting with Vitamin C.',
    dataAiHint: 'orange fruit'
  },
];
