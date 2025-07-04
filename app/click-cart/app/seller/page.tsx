'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Package, DollarSign, ShoppingCart, Eye } from 'lucide-react';
import { products } from '@/data/mockData';
import { Product } from '@/types';

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'add-product'>('products');
  const [sellerProducts, setSellerProducts] = useState<Product[]>(
    products.filter(p => p.sellerId === 'seller1') // Mock current seller
  );

  const stats = {
    totalProducts: sellerProducts.length,
    totalOrders: 23,
    totalRevenue: 2450.75,
    avgRating: 4.3
  };

  const handleDeleteProduct = (productId: string) => {
    setSellerProducts(prev => prev.filter(p => p.id !== productId));
  };

  const AddProductForm = () => (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Product Name</label>
          <input type="text" className="input w-full" placeholder="Enter product name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea className="input w-full h-32" placeholder="Enter product description"></textarea>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input type="number" className="input w-full" placeholder="0.00" step="0.01" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input type="number" className="input w-full" placeholder="0" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select className="input w-full">
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home & Garden</option>
            <option>Books</option>
            <option>Sports</option>
            <option>Beauty</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Product Images</label>
          <input type="file" className="input w-full" multiple accept="image/*" />
        </div>
        <div className="flex space-x-4">
          <button type="submit" className="btn btn-primary">Add Product</button>
          <button type="button" className="btn btn-outline">Cancel</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your products and orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <Package className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{stats.totalProducts}</h3>
          <p className="text-gray-600">Total Products</p>
        </div>
        <div className="card text-center">
          <ShoppingCart className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
          <p className="text-gray-600">Total Orders</p>
        </div>
        <div className="card text-center">
          <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold">${stats.totalRevenue}</h3>
          <p className="text-gray-600">Total Revenue</p>
        </div>
        <div className="card text-center">
          <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{stats.avgRating}</h3>
          <p className="text-gray-600">Avg Rating</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'products' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'orders' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('add-product')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'add-product' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Plus size={16} className="inline mr-2" />
            Add Product
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'products' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">My Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Stock</th>
                  <th className="text-left p-4">Rating</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellerProducts.map(product => (
                  <tr key={product.id} className="border-b">
                    <td className="p-4">
                      <div className="flex items-center">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">${product.price}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">{product.rating} ⭐</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button className="btn btn-outline p-2">
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product.id)}
                          className="btn bg-red-500 text-white hover:bg-red-600 p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          <div className="space-y-4">
            {[1, 2, 3].map(order => (
              <div key={order} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">Order #ORD-{order.toString().padStart(3, '0')}</h4>
                    <p className="text-sm text-gray-600">2 items • $89.98</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    Completed
                  </span>
                </div>
                <p className="text-sm text-gray-600">Customer: John Doe</p>
                <p className="text-sm text-gray-600">Date: Nov {order + 10}, 2024</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'add-product' && <AddProductForm />}
    </div>
  );
} 