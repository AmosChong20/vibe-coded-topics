'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearCart();
    setIsCheckingOut(false);
    alert('Order placed successfully!');
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link href="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/" className="text-primary hover:text-primary/80 mr-4">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {state.items.map(item => (
              <div key={item.product.id} className="card flex items-center p-4">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 object-cover rounded-lg mr-4"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">by {item.product.sellerName}</p>
                  <p className="text-primary font-bold text-lg">${item.product.price}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="btn btn-outline p-2"
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="font-semibold text-lg w-8 text-center">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="btn btn-outline p-2"
                  >
                    <Plus size={16} />
                  </button>
                  
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="btn bg-red-500 text-white hover:bg-red-600 p-2 ml-4"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({state.items.length} items)</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(state.total * 0.08).toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>${(state.total * 1.08).toFixed(2)}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="btn btn-primary w-full text-lg py-3"
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            
            <p className="text-sm text-gray-600 text-center mt-4">
              Secure checkout powered by ClickCart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 