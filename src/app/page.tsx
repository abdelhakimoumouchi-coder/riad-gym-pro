import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { API_BASE_URL } from '@/lib/constants';

type Banner = {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  image: string;
  link?: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
};

async function getNewProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?isNew=true&limit=8`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching new products:', error);
    return [];
  }
}

async function getSaleProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?isOnSale=true&limit=8`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching sale products:', error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?isFeatured=true&limit=8`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

async function getBanners() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/banners`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.banners || [];
  } catch (error) {
    console.error('Error fetching banners:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function HomePage() {
  const [newProducts, saleProducts, featuredProducts, banners, categories] = await Promise.all([
    getNewProducts(),
    getSaleProducts(),
    getFeaturedProducts(),
    getBanners(),
    getCategories(),
  ]);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[820px] bg-dark overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-banner.webp"
            alt="Bannière"
            fill
            priority
            className="object-cover hidden sm:block"
          />
          <Image
            src="/hero-mobile-mob.png"
            alt="Bannière mobile"
            fill
            priority
            className="object-cover sm:hidden"
          />
        </div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-repeat opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16 w-full">
            <div className="text-center lg:text-left space-y-5 lg:col-span-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-display leading-tight">
                Transformez Votre <span className="text-primary">Corps</span>
              </h1>
              <p className="text-lg md:text-xl text-white font-semibold">
                avec des Compléments Certifiés
              </p>
              <p className="text-base md:text-lg text-gray-100 max-w-2xl">
                Boostez vos performances avec nos produits de nutrition sportive certifiés en Algérie.
              </p>
              <div className="pt-2">
                <Link
                  href="/produits"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-dark font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg transition-colors"
                >
                  Découvrir nos produits
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories Section */}
      {categories.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-dark font-display">Catégories</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat: Category) => (
                <Link
                  key={cat.id}
                  href={`/produits?category=${cat.slug}`}
                  className="group rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden bg-white"
                >
                  <div className="relative w-full h-28 sm:h-32 bg-light-gray">
                    <Image
                      src={cat.image || '/placeholder.png'}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="px-3 py-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-dark line-clamp-1">
                      {cat.name}
                    </span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Banners Section (admin banners) */}
      {banners.length > 0 && (
        <section className="bg-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner: Banner) => {
                const content = (
                  <div className="relative w-full h-52 sm:h-56 lg:h-60 overflow-hidden rounded-xl shadow-md group">
                    <Image
                      src={banner.image}
                      alt={banner.title || 'Bannière'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    {(banner.title || banner.subtitle) && (
                      <div className="absolute inset-0 flex flex-col justify-center px-4 text-white drop-shadow-lg">
                        {banner.title && (
                          <h3 className="text-xl font-bold mb-1">{banner.title}</h3>
                        )}
                        {banner.subtitle && (
                          <p className="text-sm text-gray-200">{banner.subtitle}</p>
                        )}
                      </div>
                    )}
                  </div>
                );

                return banner.link ? (
                  <Link key={banner.id} href={banner.link} className="block">
                    {content}
                  </Link>
                ) : (
                  <div key={banner.id}>{content}</div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* New Products Section */}
      {newProducts.length > 0 && (
        <section className="py-16 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-dark mb-2 font-display">Nouveautés</h2>
                <p className="text-gray-600">Découvrez nos derniers produits</p>
              </div>
              <Link
                href="/produits?nouveautes=true"
                className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
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

      {/* Sale Products Section */}
      {saleProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-dark mb-2 font-display">Promotions</h2>
                <p className="text-gray-600">Profitez de nos meilleures offres</p>
              </div>
              <Link
                href="/produits?promotions=true"
                className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-dark mb-2 font-display">Produits Populaires</h2>
                <p className="text-gray-600">Les préférés de nos clients</p>
              </div>
              <Link
                href="/produits"
                className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" />
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

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">Livraison Rapide</h3>
              <p className="text-gray-600">
                Livraison à travers les 58 wilayas avec suivi de commande
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex itemsCenter justifyCenter items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">Qualité Garantie</h3>
              <p className="text-gray-600">
                Produits authentiques certifiés et testés en laboratoire
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-dark mb-2">Paiement Sécurisé</h3>
              <p className="text-gray-600">
                Paiement à la livraison, CCP ou BaridiMob en toute sécurité
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}