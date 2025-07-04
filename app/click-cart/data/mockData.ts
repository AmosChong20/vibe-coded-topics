import { Product, Category } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'Electronics', icon: 'smartphone' },
  { id: '2', name: 'Fashion', icon: 'shirt' },
  { id: '3', name: 'Home & Garden', icon: 'home' },
  { id: '4', name: 'Books', icon: 'book' },
  { id: '5', name: 'Sports', icon: 'dumbbell' },
  { id: '6', name: 'Beauty', icon: 'sparkles' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
    price: 89.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    category: 'Electronics',
    sellerId: 'seller1',
    sellerName: 'TechWorld',
    stock: 25,
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'Smartphone Case',
    description: 'Durable protective case for smartphones with shock absorption and wireless charging compatibility.',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1601593346740-925612772716?w=400'],
    category: 'Electronics',
    sellerId: 'seller1',
    sellerName: 'TechWorld',
    stock: 50,
    rating: 4.2,
    reviews: 89
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    description: 'Comfortable 100% cotton t-shirt available in multiple colors and sizes.',
    price: 19.99,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'],
    category: 'Fashion',
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    stock: 100,
    rating: 4.3,
    reviews: 256
  },
  {
    id: '4',
    name: 'Denim Jeans',
    description: 'Classic fit denim jeans made from high-quality cotton blend.',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'],
    category: 'Fashion',
    sellerId: 'seller2',
    sellerName: 'Fashion Hub',
    stock: 75,
    rating: 4.1,
    reviews: 167
  },
  {
    id: '5',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe and auto-shutoff feature.',
    price: 79.99,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'],
    category: 'Home & Garden',
    sellerId: 'seller3',
    sellerName: 'Home Essentials',
    stock: 30,
    rating: 4.4,
    reviews: 93
  },
  {
    id: '6',
    name: 'Indoor Plant Set',
    description: 'Set of 3 low-maintenance indoor plants perfect for home decoration.',
    price: 34.99,
    images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'],
    category: 'Home & Garden',
    sellerId: 'seller3',
    sellerName: 'Home Essentials',
    stock: 45,
    rating: 4.6,
    reviews: 72
  },
  {
    id: '7',
    name: 'Programming Book',
    description: 'Comprehensive guide to modern web development with practical examples.',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
    category: 'Books',
    sellerId: 'seller4',
    sellerName: 'BookStore Plus',
    stock: 60,
    rating: 4.7,
    reviews: 145
  },
  {
    id: '8',
    name: 'Yoga Mat',
    description: 'High-quality non-slip yoga mat with carrying strap and extra cushioning.',
    price: 29.99,
    images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'],
    category: 'Sports',
    sellerId: 'seller5',
    sellerName: 'Fitness Pro',
    stock: 80,
    rating: 4.5,
    reviews: 234
  },
  {
    id: '9',
    name: 'Skincare Set',
    description: 'Complete skincare routine set with cleanser, toner, serum, and moisturizer.',
    price: 64.99,
    images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400'],
    category: 'Beauty',
    sellerId: 'seller6',
    sellerName: 'Beauty Boutique',
    stock: 35,
    rating: 4.8,
    reviews: 189
  },
  {
    id: '10',
    name: 'Wireless Charger',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 34.99,
    images: ['https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400'],
    category: 'Electronics',
    sellerId: 'seller1',
    sellerName: 'TechWorld',
    stock: 40,
    rating: 4.3,
    reviews: 98
  }
]; 