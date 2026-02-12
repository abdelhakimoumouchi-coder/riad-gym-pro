'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  ShoppingCart,
  Tag,
  Image as ImageIcon,
  LogOut,
  List,
  Plus,
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-dark min-h-screen text-white flex flex-col">
      <div className="p-6 border-b border-dark-lighter">
        <Link href="/admin" className="text-2xl font-bold text-primary">
          RIAD GYM
        </Link>
        <p className="text-sm text-gray-400 mt-1">Administration</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {/* Produits */}
        <div className="space-y-1">
          <div className="text-gray-400 text-xs font-semibold uppercase px-4">Produits</div>
          <Link
            href="/admin/produits"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/admin/produits') || pathname?.startsWith('/admin/produits/')
                ? 'bg-primary text-white'
                : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="font-medium">Liste</span>
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

        {/* Commandes */}
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

        {/* Catégories */}
        <Link
          href="/admin/categories"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/admin/categories') || pathname?.startsWith('/admin/categories')
              ? 'bg-primary text-white'
              : 'text-gray-300 hover:bg-dark-lighter hover:text-white'
          }`}
        >
          <Tag className="w-5 h-5" />
          <span className="font-medium">Catégories</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-dark-lighter">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-dark-lighter hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}