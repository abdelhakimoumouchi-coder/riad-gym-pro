'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Search, Menu, X, ChevronDown, Home, Tag, Package } from 'lucide-react';
import Cart from './Cart';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/produits?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              role="button"
              aria-label="Aller à l'accueil"
            >
              <div className="text-2xl font-bold text-dark">
                RI GYM <span className="text-primary">PRO</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="flex items-center space-x-1 text-dark hover:text-primary transition-colors"
                  onBlur={() => setTimeout(() => setShowCategoryMenu(false), 200)}
                >
                  <ChevronDown className="w-4 h-4" />
                  <span>Catégories</span>
                </button>
                {showCategoryMenu && (
                  <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg py-2 min-w-[200px] border border-gray-200">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/produits?categorie=${category.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Desktop */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary text-white p-2 rounded-full"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-dark hover:text-primary transition-colors"
                aria-label="Panier"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile: panier + menu */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative text-dark hover:text-primary transition-colors"
                aria-label="Panier"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-dark hover:text-primary transition-colors"
                aria-label="Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay sombre quand menu ouvert */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Panneau slide depuis la droite */}
      <div
        className={`fixed top-0 right-0 h-full w-[65%] max-w-[280px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-lg font-bold text-dark">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-gray-400 hover:text-dark transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-1">
          {/* Accueil */}
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark hover:bg-gray-50 transition-colors"
          >
            <Home className="w-5 h-5 text-[#f28c28]" />
            <span className="font-medium">Accueil</span>
          </Link>

          {/* Séparateur */}
          <div className="py-2">
            <div className="h-px bg-gray-100" />
          </div>

          {/* Titre catégories */}
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Catégories
          </p>

          {/* Liste catégories */}
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/produits?categorie=${category.slug}`}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark hover:bg-gray-50 transition-colors"
            >
              <span className="text-[#f28c28]">›</span>
              <span className="font-medium">{category.name}</span>
            </Link>
          ))}

          {/* Séparateur */}
          <div className="py-2">
            <div className="h-px bg-gray-100" />
          </div>

          {/* Promotions */}
          <Link
            href="/produits?promotions=true"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark hover:bg-gray-50 transition-colors"
          >
            <Tag className="w-5 h-5 text-red-500" />
            <span className="font-medium">Promotions</span>
          </Link>

          {/* Packs */}
          <Link
            href="/produits?packs=true"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark hover:bg-gray-50 transition-colors"
          >
            <Package className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Packs</span>
          </Link>
        </div>
      </div>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}