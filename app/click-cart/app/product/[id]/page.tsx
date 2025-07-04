'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Star, Heart, Share2, Truck } from 'lucide-react';
import { products } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';

interface ProductPageProps {
  params: { id: string };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find(p => p.id === params.id);
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link href="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setTimeout(() => setIsAddingToCart(false), 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/" className="text-primary hover:text-primary/80 mr-4">
          <ArrowLeft size={20} />
        </Link>
        <nav className="text-sm text-gray-600">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">{product.category}</span>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          <div className="mb-4">
            <Image
              src={product.images[selectedImageIndex]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-primary' : 'border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-lg">{product.rating}</span>
            </div>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>
          
          <div className="text-4xl font-bold text-primary mb-6">${product.price}</div>
          
          <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Truck className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-600 font-medium">Free shipping on orders over $50</span>
            </div>
            <p className="text-sm text-gray-600">
              Sold by <span className="font-medium text-primary">{product.sellerName}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center">
              <label className="text-sm font-medium mr-2">Quantity:</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="input w-20"
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-sm text-gray-600">
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
          </div>
          
          <div className="flex space-x-4 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className={`btn btn-primary flex-1 flex items-center justify-center ${
                product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ShoppingCart size={20} className="mr-2" />
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            
            <button className="btn btn-outline p-3">
              <Heart size={20} />
            </button>
            
            <button className="btn btn-outline p-3">
              <Share2 size={20} />
            </button>
          </div>
          
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium w-24">Category:</span>
                <span>{product.category}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">Stock:</span>
                <span>{product.stock} units</span>
              </div>
              <div className="flex">
                <span className="font-medium w-24">Seller:</span>
                <span>{product.sellerName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 