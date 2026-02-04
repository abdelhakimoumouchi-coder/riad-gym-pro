'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const loadCart = () => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);
    setLoading(false);
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id: string) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-light-gray flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-light-gray py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-dark mb-8 font-display">Mon Panier</h1>

          {cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-dark mb-4">Votre panier est vide</h2>
              <p className="text-gray-600 mb-8">
                Découvrez nos produits et ajoutez-en à votre panier
              </p>
              <Link
                href="/produits"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Découvrir nos produits
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link href={`/produits/${item.slug}`} className="relative w-24 h-24 flex-shrink-0 bg-light-gray rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/produits/${item.slug}`}>
                          <h3 className="text-lg font-semibold text-dark hover:text-primary transition-colors mb-2 line-clamp-2">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="text-xl font-bold text-primary mb-4">
                          {formatPrice(item.price)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 bg-light-gray hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-semibold w-12 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 bg-light-gray hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
                          >
                            <X className="w-5 h-5" />
                            <span className="text-sm">Retirer</span>
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right hidden sm:block">
                        <div className="text-sm text-gray-600 mb-1">Total</div>
                        <div className="text-xl font-bold text-dark">
                          {formatPrice(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-dark mb-6">Récapitulatif</h2>

                  <div className="space-y-3 mb-6 pb-6 border-b">
                    <div className="flex justify-between text-gray-700">
                      <span>Sous-total</span>
                      <span className="font-semibold">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Livraison</span>
                      <span className="text-sm text-gray-500">Calculé à l&apos;étape suivante</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-bold text-dark mb-6">
                    <span>Sous-total</span>
                    <span className="text-primary">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="space-y-3">
                    <Link
                      href="/checkout"
                      className="block w-full bg-primary hover:bg-primary-dark text-white py-4 px-6 rounded-lg font-semibold text-center transition-colors"
                    >
                      Commander
                    </Link>
                    <Link
                      href="/produits"
                      className="block w-full bg-white hover:bg-light-gray text-dark py-4 px-6 rounded-lg font-semibold text-center border-2 border-dark transition-colors"
                    >
                      Continuer mes achats
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span>Livraison 58 wilayas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      <span>Garantie qualité</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
