import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProductPage from './pages/ProductPage';
import SellerPage from './pages/SellerPage';

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/seller" element={<SellerPage />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

export default App; 