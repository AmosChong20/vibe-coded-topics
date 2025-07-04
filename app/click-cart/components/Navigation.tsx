'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Search, Menu, User, Store } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function Navigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const { getItemCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            ClickCart
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full input pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link href="/categories" className="text-gray-700 hover:text-primary flex items-center">
              <Menu size={20} className="mr-1" />
              Categories
            </Link>
            
            <Link href="/seller" className="text-gray-700 hover:text-primary flex items-center">
              <Store size={20} className="mr-1" />
              Sell
            </Link>
            
            <Link href="/account" className="text-gray-700 hover:text-primary flex items-center">
              <User size={20} className="mr-1" />
              Account
            </Link>
            
            <Link href="/cart" className="text-gray-700 hover:text-primary flex items-center relative">
              <ShoppingCart size={20} className="mr-1" />
              Cart
              {getItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 