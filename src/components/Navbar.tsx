'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { ShoppingCart, Search, User, ChevronDown, Menu, X } from 'lucide-react';
import Cart from './Cart';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function Navbar() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
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

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-dark">
                RIAD GYM <span className="text-primary">PRO</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center space-x-1 text-dark hover:text-primary transition-colors"
                  onBlur={() => setTimeout(() => setShowAccountMenu(false), 200)}
                >
                  <User className="w-5 h-5" />
                  <span>Compte</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showAccountMenu && (
                  <div className="absolute top-full mt-2 right-0 bg-white shadow-lg rounded-lg py-2 min-w-[200px] border border-gray-200">
                    {session ? (
                      <>
                        <Link
                          href="/compte"
                          className="block px-4 py-2 text-dark hover:bg-light-gray transition-colors"
                        >
                          Mon Compte
                        </Link>
                        <Link
                          href="/compte/commandes"
                          className="block px-4 py-2 text-dark hover:bg-light-gray transition-colors"
                        >
                          Mes Commandes
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-dark hover:bg-light-gray transition-colors"
                        >
                          Déconnexion
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-2 text-dark hover:bg-light-gray transition-colors"
                        >
                          Connexion
                        </Link>
                        <Link
                          href="/auth/register"
                          className="block px-4 py-2 text-dark hover:bg-light-gray transition-colors"
                        >
                          Inscription
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                  className="flex items-center space-x-1 text-dark hover:text-primary transition-colors"
                  onBlur={() => setTimeout(() => setShowCategoryMenu(false), 200)}
                >
                  <span>Catégories</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showCategoryMenu && (
                  <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg py-2 min-w-[200px] border border-gray-200">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/produits?category=${category.slug}`}
                        className="block px-4 py-2 text-dark hover:bg-light-gray transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Promotions & Packs routed with query params */}
              <Link
                href="/produits?promotions=true"
                className="text-dark hover:text-primary transition-colors"
              >
                Promotions
              </Link>

              <Link
                href="/produits?packs=true"
                className="text-dark hover:text-primary transition-colors"
              >
                Packs
              </Link>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher des produits..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </form>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative text-dark hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-dark"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4 space-y-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </form>

              <div className="space-y-2">
                {session ? (
                  <>
                    <Link href="/compte" className="block py-2 text-dark hover:text-primary">
                      Mon Compte
                    </Link>
                    <Link href="/compte/commandes" className="block py-2 text-dark hover:text-primary">
                      Mes Commandes
                    </Link>
                    <button onClick={handleLogout} className="block w-full text-left py-2 text-dark hover:text-primary">
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block py-2 text-dark hover:text-primary">
                      Connexion
                    </Link>
                    <Link href="/auth/register" className="block py-2 text-dark hover:text-primary">
                      Inscription
                    </Link>
                  </>
                )}
              </div>

              <div className="border-t pt-4">
                <div className="font-semibold mb-2">Catégories</div>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/produits?category=${category.slug}`}
                    className="block py-2 text-dark hover:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              <Link href="/produits?promotions=true" className="block py-2 text-dark hover:text-primary">
                Promotions
              </Link>
              <Link href="/produits?packs=true" className="block py-2 text-dark hover:text-primary">
                Packs
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}