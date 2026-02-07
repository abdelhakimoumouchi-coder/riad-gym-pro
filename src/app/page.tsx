import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, CreditCard, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { API_BASE_URL } from '@/lib/constants';

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

export default async function HomePage() {
  const [newProducts, saleProducts, featuredProducts] = await Promise.all([
    getNewProducts(),
    getSaleProducts(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[640px] bg-dark overflow-hidden">
        {/* Backgrounds : desktop / mobile */}
        <div className="absolute inset-0">
          <Image
            src="/hero-banner.png"          // desktop (paysage)
            alt="Bannière"
            fill
            priority
            className="object-cover hidden sm:block"
          />
          <Image
            src="/hero-mobile-mob.png"          // mobile (portrait)
            alt="Bannière mobile"
            fill
            priority
            className="object-cover sm:hidden"
          />
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45" />
        {/* Optional pattern */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-repeat opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-16 w-full">
            {/* Logo à gauche (caché sur mobile si tu veux, ici on laisse visible) */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-[220px] h-[220px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] drop-shadow-2xl">
                <Image
                  src="/hero-logo.png" // place ton logo ici (public/hero-logo.png)
                  alt="Riad Gym Pro"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Texte + CTA à droite */}
            <div className="text-center lg:text-left space-y-5">
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
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-dark via-dark-light to-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Star className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4 font-display">
            Prêt à Commencer Votre Transformation ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez des milliers de clients satisfaits à travers l&apos;Algérie
          </p>
          <Link
            href="/produits"
            className="bg-primary hover:bg-primary-dark text-dark font-semibold px-8 py-4 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            Commencer maintenant
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}