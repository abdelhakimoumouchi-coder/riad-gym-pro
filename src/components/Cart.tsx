'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(cart);
    };

    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    window.addEventListener('storage', loadCart);

    return () => {
      window.removeEventListener('cartUpdated', loadCart);
      window.removeEventListener('storage', loadCart);
    };
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const cart = [...cartItems];
    const item = cart.find(item => item.id === id);
    
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      setCartItems(cart);
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const removeItem = (id: string) => {
    const cart = cartItems.filter(item => item.id !== id);
    setCartItems(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-dark flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            Panier ({cartItems.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light-gray rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg mb-2">Votre panier est vide</p>
              <p className="text-gray-500 text-sm mb-6">
                Ajoutez des produits pour commencer vos achats
              </p>
              <Link
                href="/produits"
                onClick={onClose}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Voir les produits
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 bg-light-gray p-3 rounded-lg">
                  {/* Image */}
                  <Link
                    href={`/produits/${item.slug}`}
                    onClick={onClose}
                    className="relative w-20 h-20 flex-shrink-0 bg-white rounded overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produits/${item.slug}`}
                      onClick={onClose}
                      className="font-medium text-dark hover:text-primary line-clamp-2 mb-1"
                    >
                      {item.name}
                    </Link>
                    <div className="text-primary font-bold mb-2">
                      {formatPrice(item.price)}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-7 h-7 flex items-center justify-center bg-white hover:bg-primary hover:text-white rounded border border-gray-300 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-7 h-7 flex items-center justify-center bg-white hover:bg-primary hover:text-white rounded border border-gray-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-dark">Sous-total:</span>
              <span className="font-bold text-primary text-xl">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Frais de livraison calculés à la caisse
            </p>

            {/* Buttons */}
            <div className="space-y-2">
              <Link
                href="/panier"
                onClick={onClose}
                className="block w-full bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 rounded-lg font-medium text-center transition-colors"
              >
                Voir le panier
              </Link>
              <Link
                href="/commander"
                onClick={onClose}
                className="block w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-medium text-center transition-colors"
              >
                Commander
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
