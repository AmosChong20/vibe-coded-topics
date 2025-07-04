'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { products, categories } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';

export default function HomePage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    if (selectedCategory) {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-8 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to ClickCart</h1>
          <p className="text-xl mb-6">
            Your one-stop marketplace for everything you need. Browse thousands of products 
            from trusted sellers, all in one convenient location.
          </p>
          <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Shopping
          </button>
        </div>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              onSelect={setSelectedCategory}
              isSelected={selectedCategory === category.name}
            />
          ))}
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory('')}
            className="mt-4 text-primary hover:text-primary/80"
          >
            Clear filter
          </button>
        )}
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold mb-6">
          {selectedCategory ? `${selectedCategory} Products` : 'Featured Products'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
} 