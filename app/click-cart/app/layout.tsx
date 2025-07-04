import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ClickCart - Online Marketplace',
  description: 'A simple online marketplace with universal cart functionality',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
} 