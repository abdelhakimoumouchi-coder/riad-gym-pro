import Link from 'next/link';
import Image from 'next/image';
import { Truck, Shield, CreditCard } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';
import { Product } from '@/types';
import { prisma } from '@/lib/prisma';

export const revalidate = 300;

type Category = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
};

function getSafeCategoryImage(category: Category) {
  if (!category.image) return '/placeholder.png';

  const img = category.image.trim();

  // ✅ Autoriser les images base64 stockées en DB
  if (img.startsWith('data:image/')) {
    return img;
  }

  // ✅ Autoriser URLs absolues
  if (img.startsWith('http://') || img.startsWith('https://')) {
    return img;
  }

  // ✅ Autoriser chemins locaux propres
  if (img.startsWith('/')) {
    return img;
  }

  return '/placeholder.png';
}

async function getNewProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      where: { isNew: true },
      orderBy: [
        { displayOrder: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 8,
      include: {
        category: true,
      },
    });
  } catch {
    return [];
  }
}

async function getSaleProducts(): Promise<Product[]> {
  try {
    return await prisma.product.findMany({
      where: { isOnSale: true },
      orderBy: [
        { displayOrder: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 8,
      include: {
        category: true,
      },
    });
  } catch {
    return [];
  }
}

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const featured = await prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: [
        { displayOrder: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 8,
      include: {
        category: true,
      },
    });

    if (featured.length >= 4) return featured;

    const fallback = await prisma.product.findMany({
      where: {
        stock: { gt: 0 },
      },
      orderBy: [
        { displayOrder: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 8,
      include: {
        category: true,
      },
    });

    return fallback;
  } catch {
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    return await prisma.category.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
      },
    });
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
      <section className="relative h-[560px] sm:h-[780px] overflow-hidden">
        <Image
          src="/hero-banner.webp"
          alt="Hero"
          fill
          priority
          fetchPriority="high"
          quality={82}
          className="object-cover will-change-transform"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/70" />

        {/* Bloc Catégories + Recherche */}
        {categories.length > 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-10">
            <div className="w-full max-w-xl mb-6 sm:mb-8">
              <SearchBar />
            </div>

            <div className="text-center mb-5 sm:mb-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
                Catégories
              </h2>
              <div className="mx-auto mt-2 h-[3px] w-24 rounded-full bg-[#f28c28]" />
            </div>

            <div className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 [-webkit-overflow-scrolling:touch] scrollbar-thin scrollbar-thumb-gray-400/50 scrollbar-track-transparent">
              <div className="flex gap-3 sm:gap-6 w-max min-w-full whitespace-nowrap pr-4 sm:pr-6">
                {categories.map((cat: Category) => (
                  <Link
                    key={cat.id}
                    href={`/produits?category=${cat.slug}`}
                    className="group relative snap-start flex-shrink-0 w-[200px] h-[180px] sm:w-[240px] sm:h-[210px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_20px_60px_-25px_rgba(0,0,0,0.55)] transition hover:-translate-y-[2px]"
                  >
                    <Image
                      src={getSafeCategoryImage(cat)}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 62vw, (max-width: 768px) 50vw, 240px"
                      unoptimized={getSafeCategoryImage(cat).startsWith('data:image/')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/25 to-black/70" />
                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 flex items-center justify-between">
                      <span className="text-white text-base sm:text-lg font-semibold drop-shadow">
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
        <section className="py-12 sm:py-14 lg:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-dark mb-2 font-display">Promotions</h3>
                <p className="text-gray-600">Profitez de nos meilleures offres</p>
              </div>
              <Link
                href="/produits?promotions=true"
                className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
              >
                Voir tout
                <span className="text-lg">›</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 content-start">
              {saleProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nouveautés */}
      {newProducts.length > 0 && (
        <section className="py-12 sm:py-14 lg:py-16 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-dark mb-2 font-display">Nouveautés</h3>
                <p className="text-gray-600">Découvrez nos derniers produits</p>
              </div>
              <Link
                href="/produits?nouveautes=true"
                className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
              >
                Voir tout
                <span className="text-lg">›</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 content-start">
              {newProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produits Populaires */}
      {featuredProducts.length > 0 && (
        <section className="py-12 sm:py-14 lg:py-16 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-dark mb-2 font-display">Produits Populaires</h3>
                <p className="text-gray-600">Les préférés de nos clients</p>
              </div>
              <Link
                href="/produits"
                className="text-primary hover:text-primary-dark font-semibold inline-flex items-center gap-2 self-start sm:self-auto"
              >
                Voir tout
                <span className="text-lg">›</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 content-start">
              {featuredProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-12 sm:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-dark mb-2">Livraison Rapide</h4>
              <p className="text-gray-600">
                Livraison à travers les 58 wilayas avec suivi de commande
              </p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-dark mb-2">Qualité Garantie</h4>
              <p className="text-gray-600">
                Produits authentiques certifiés et testés en laboratoire
              </p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-dark mb-2">Paiement Sécurisé</h4>
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
