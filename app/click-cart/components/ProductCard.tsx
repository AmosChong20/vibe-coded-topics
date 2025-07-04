'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddingToCart(true);
    addToCart(product);
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  return (
    <div className="card group cursor-pointer">
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-lg mb-4">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
            <Heart size={16} className="text-gray-600" />
          </button>
        </div>
      </Link>
      
      <div className="flex-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-primary">${product.price}</span>
          <span className="text-sm text-gray-500">by {product.sellerName}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className={`btn btn-primary flex items-center ${
              product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ShoppingCart size={16} className="mr-2" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
} 