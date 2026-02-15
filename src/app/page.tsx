import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Truck, Shield, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { Product } from '@/types';
import { API_BASE_URL } from '@/lib/constants';

type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
};

async function getNewProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?isNew=true&limit=8`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getSaleProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?isOnSale=true&limit=8`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?isFeatured=true&limit=8`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [newProducts, saleProducts, featuredProducts, categories] = await Promise.all([
    getNewProducts(),
    getSaleProducts(),
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />

      {/* HERO plein écran avec overlay sombre */}
      <section className="relative h-[620px] sm:h-[820px] overflow-hidden">
        <Image
          src="/hero-banner.webp"
          alt="Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/70" />

        {/* Bloc Catégories + Recherche */}
        {categories.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">

            {/* Barre de recherche transparente */}
            <div className="w-full max-w-xl mb-8">
              <SearchBar />
            </div>

            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
                Catégories
              </h2>
              <div className="mx-auto mt-2 h-[3px] w-24 rounded-full bg-[#f28c28]" />
            </div>

            <div className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory px-1 [-webkit-overflow-scrolling:touch] scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent w-full">
              <div className="flex gap-4 sm:gap-6 w-full overflow-x-auto whitespace-nowrap pr-6">
                {categories.map((cat: Category) => (
                  <Link
                    key={cat.id}
                    href={`/produits?category=${cat.slug}`}
                    className="group relative snap-start flex-shrink-0 w-[220px] h-[200px] sm:w-[240px] sm:h-[210px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)] transition hover:-translate-y-[2px]"
                  >
                    <Image
                      src={cat.image || '/placeholder.png'}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 75vw, 240px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/70" />
                    <div className="absolute inset-x-0 bottom-0 p-4 flex items-center justify-between">
                      <span className="text-white text-lg font-semibold drop-shadow">
                        {cat.name}
                      </span>
                      <span className="text-[#f28c28] text-xl leading-none transition group-hover:translate-x-1">
                        ›
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Promotions */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-bold text-dark mb-2 font-display">Promotions</h3>
                <p className="text-gray-600">Profitez de nos meilleures offres</p>
              </div>
              <Link
                href="/produits?promotions=true"
                className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2"
              >
                Voir tout
                <span className="text-lg">›</span>
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [-webkit-overflow-scrolling:touch] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {saleProducts.map((product: Product) => (
                <div key={product.id} className="min-w-[240px] max-w-[260px] snap-start flex-shrink-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nouveautés */}
      {newProducts.length > 0 && (
        <section className="py-16 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-bold text-dark mb-2 font-display">Nouveautés</h3>
                <p className="text-gray-600">Découvrez nos derniers produits</p>
              </div>
              <Link
                href="/produits?nouveautes=true"
                className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2"
              >
                Voir tout
                <span className="text-lg">›</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Populaires */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-3xl font-bold text-dark mb-2 font-display">Produits Populaires</h3>
                <p className="text-gray-600">Les préférés de nos clients</p>
              </div>
              <Link
                href="/produits"
                className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2"
              >
                Voir tout
                <span className="text-lg">›</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-dark mb-2">Livraison Rapide</h4>
              <p className="text-gray-600">Livraison à travers les 58 wilayas avec suivi de commande</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-dark mb-2">Qualité Garantie</h4>
              <p className="text-gray-600">Produits authentiques certifiés et testés en laboratoire</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-dark mb-2">Paiement Sécurisé</h4>
              <p className="text-gray-600">Paiement à la livraison, CCP ou BaridiMob en toute sécurité</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}