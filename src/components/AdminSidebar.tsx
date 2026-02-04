'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderOpen,
  Image as ImageIcon,
  ChevronDown,
  ChevronRight,
  LogOut,
  Plus,
  List,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [showProductsMenu, setShowProductsMenu] = useState(true);

  const isActive = (path: string) => pathname === path;
  const isParentActive = (parentPath: string) => pathname?.startsWith(parentPath);

  const handleLogout = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await fetch('/api/auth/signout', { method: 'POST' });
      window.location.href = '/auth/login';
    }
  };

  return (
    <aside className="w-64 bg-dark min-h-screen text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-lighter">
        <Link href="/admin" className="text-2xl font-bold">
          RIAD <span className="text-primary">GYM</span>
        </Link>
        <p className="text-gray-400 text-sm mt-1">Administration</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Dashboard */}
        <Link
          href="/admin"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin')
              ? 'bg-primary text-white'
              : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* Products */}
        <div>
          <button
            onClick={() => setShowProductsMenu(!showProductsMenu)}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
              isParentActive('/admin/produits')
                ? 'bg-primary/20 text-primary'
                : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5" />
              <span className="font-medium">Produits</span>
            </div>
            {showProductsMenu ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {showProductsMenu && (
            <div className="ml-4 mt-1 space-y-1">
              <Link
                href="/admin/produits"
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/produits')
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="text-sm">Liste</span>
              </Link>
              <Link
                href="/admin/produits/nouveau"
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/admin/produits/nouveau')
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-dark-lighter hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Nouveau</span>
              </Link>
            </div>
          )}
        </div>

        {/* Orders */}
        <Link
          href="/admin/commandes"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/commandes') || pathname?.startsWith('/admin/commandes/')
              ? 'bg-primary text-white'
              : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="font-medium">Commandes</span>
        </Link>

        {/* Categories */}
        <Link
          href="/admin/categories"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/categories')
              ? 'bg-primary text-white'
              : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
          }`}
        >
          <FolderOpen className="w-5 h-5" />
          <span className="font-medium">Catégories</span>
        </Link>

        {/* Banners */}
        <Link
          href="/admin/bannieres"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/bannieres')
              ? 'bg-primary text-white'
              : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          <span className="font-medium">Bannières</span>
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-dark-lighter">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-dark-lighter hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
