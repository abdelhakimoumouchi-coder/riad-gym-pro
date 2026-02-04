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
    category: {
      name: string;
      slug: string;
    };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const discount = product.comparePrice && product.isOnSale
    ? calculateDiscount(product.comparePrice, product.price)
    : 0;

  const addToCart = () => {
    setIsAdding(true);
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.thumbnail || product.images[0] || '/placeholder.png',
        quantity: 1,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => setIsAdding(false), 1000);
  };

  const buyNow = () => {
    addToCart();
    setTimeout(() => {
      window.location.href = '/panier';
    }, 500);
  };

  const imageUrl = product.thumbnail || product.images[0] || '/placeholder.png';

  return (
    <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <Link href={`/produits/${product.slug}`} className="block relative aspect-square overflow-hidden bg-light-gray">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
              NOUVEAU
            </span>
          )}
          {product.isOnSale && discount > 0 && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              -{discount}%
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute top-2 right-2">
          <Link
            href={`/produits?categorie=${product.category.slug}`}
            className="bg-white/90 backdrop-blur-sm text-dark px-3 py-1 rounded-full text-xs font-medium hover:bg-primary hover:text-white transition-colors"
          >
            {product.category.name}
          </Link>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/produits/${product.slug}`}>
          <h3 className="font-semibold text-lg text-dark group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {product.shortDesc && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product.shortDesc}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.isOnSale && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={addToCart}
            disabled={isAdding}
            className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? 'Ajouté!' : 'Ajouter'}
          </button>
          <button
            onClick={buyNow}
            className="flex-1 bg-dark hover:bg-dark-light text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Acheter
          </button>
        </div>
      </div>
    </div>
  );
}
