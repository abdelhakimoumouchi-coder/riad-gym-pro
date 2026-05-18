'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Zap } from 'lucide-react';
import { formatPrice, calculateDiscount } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    shortDesc?: string | null;
    price: number;
    comparePrice?: number | null;
    thumbnail?: string | null;
    images: string[];
    isNew: boolean;
    isOnSale: boolean;
    stock?: number | null;
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const discount =
    product.comparePrice && product.isOnSale
      ? calculateDiscount(product.comparePrice, product.price)
      : 0;

  const inStock = (product.stock ?? 0) > 0;

  const imageUrl =
    product.thumbnail ||
    product.images?.[0] ||
    '/placeholder.png';

  const addToCart = () => {
    if (!inStock) return;

    setIsAdding(true);

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const existingItem = cart.find(
      (item: any) => item.id === product.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: imageUrl,
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => {
      setIsAdding(false);
    }, 900);
  };

  const buyNow = () => {
    if (!inStock) return;

    addToCart();

    setTimeout(() => {
      window.location.href = '/panier';
    }, 350);
  };

  return (
    <div className="group relative h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Badge catégorie */}
      <Link
        href={`/produits?categorie=${product.category.slug}`}
        className="absolute top-2 right-2 max-w-[70%] truncate bg-white/90 backdrop-blur-sm text-dark px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium hover:bg-primary hover:text-white transition-colors z-20"
      >
        {product.category.name}
      </Link>

      {/* Image */}
      <Link
        href={`/produits/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-light-gray"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          quality={82}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="bg-primary text-white px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold">
              NOUVEAU
            </span>
          )}

          {product.isOnSale && discount > 0 && (
            <span className="bg-red-600 text-white px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold">
              -{discount}%
            </span>
          )}

          {!inStock && (
            <span className="bg-red-700 text-white px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold">
              RUPTURE
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <Link href={`/produits/${product.slug}`}>
          <h3 className="font-semibold text-sm sm:text-base lg:text-lg text-dark group-hover:text-primary transition-colors line-clamp-2 mb-1.5 sm:mb-2">
            {product.name}
          </h3>
        </Link>

        {product.shortDesc && (
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2 sm:mb-3">
            {product.shortDesc}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 flex-wrap">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>

          {product.comparePrice && product.isOnSale && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={addToCart}
            disabled={!inStock || isAdding}
            className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

            {!inStock
              ? 'Rupture'
              : isAdding
              ? 'Ajouté !'
              : 'Ajouter'}
          </button>

          <button
            type="button"
            onClick={buyNow}
            disabled={!inStock}
            className="flex-1 bg-dark hover:bg-dark-light text-white py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            {!inStock ? 'Indispo' : 'Acheter'}
          </button>
        </div>
      </div>
    </div>
  );
}
