'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Loading from '@/components/Loading';
import { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { ShoppingCart, Minus, Plus, Truck, Shield, RotateCcw, Tag } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) throw new Error('Product not found');
      const data = await res.json();
      setProduct(data);

      // Fetch similar products
      if (data.categoryId) {
        const simRes = await fetch(`/api/products?categoryId=${data.categoryId}&limit=4`);
        const simData = await simRes.json();
        setSimilarProducts((simData.products || []).filter((p: Product) => p.id !== data.id));
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product) return;
    
    setAddingToCart(true);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.thumbnail || product.images[0] || '/placeholder.png',
        quantity,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => setAddingToCart(false), 1000);
  };

  const buyNow = () => {
    addToCart();
    setTimeout(() => {
      window.location.href = '/panier';
    }, 500);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-light-gray flex items-center justify-center">
          <Loading />
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-light-gray flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-dark mb-4">Produit introuvable</h1>
            <Link href="/produits" className="text-primary hover:text-primary-dark">
              Retour aux produits
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const discount = product.comparePrice && product.isOnSale
    ? calculateDiscount(product.comparePrice, product.price)
    : 0;

  const images = product.images.length > 0 ? product.images : ['/placeholder.png'];
  const inStock = product.stock > 0;

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-light-gray py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-primary">Accueil</Link>
            <span>/</span>
            <Link href="/produits" className="hover:text-primary">Produits</Link>
            <span>/</span>
            <Link href={`/produits?categorie=${product.category.slug}`} className="hover:text-primary">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-dark">{product.name}</span>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Images Gallery */}
              <div>
                <div className="relative aspect-square bg-light-gray rounded-lg overflow-hidden mb-4">
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  {product.isOnSale && discount > 0 && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-semibold">
                      -{discount}%
                    </div>
                  )}
                  {product.isNew && (
                    <div className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-full font-semibold">
                      NOUVEAU
                    </div>
                  )}
                </div>
                
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative aspect-square bg-light-gray rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImage === idx ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <Link
                  href={`/produits?categorie=${product.category.slug}`}
                  className="inline-block text-primary hover:text-primary-dark font-medium mb-2"
                >
                  {product.category.name}
                </Link>
                
                <h1 className="text-3xl font-bold text-dark mb-4 font-display">{product.name}</h1>

                {product.shortDesc && (
                  <p className="text-gray-600 mb-6">{product.shortDesc}</p>
                )}

                {/* Price */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && product.isOnSale && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  {inStock ? (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="font-medium">En stock ({product.stock} disponibles)</span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="font-medium">Rupture de stock</span>
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                {inStock && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-dark mb-2">Quantité</label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 bg-light-gray hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="w-10 h-10 bg-light-gray hover:bg-gray-300 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                {inStock && (
                  <div className="flex gap-4 mb-8">
                    <button
                      onClick={addToCart}
                      disabled={addingToCart}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-4 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {addingToCart ? 'Ajouté!' : 'Ajouter au panier'}
                    </button>
                    <button
                      onClick={buyNow}
                      className="flex-1 bg-dark hover:bg-dark-light text-white py-4 px-6 rounded-lg font-semibold transition-colors"
                    >
                      Acheter maintenant
                    </button>
                  </div>
                )}

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-dark">Livraison rapide</div>
                      <div className="text-sm text-gray-600">58 wilayas</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-dark">Qualité garantie</div>
                      <div className="text-sm text-gray-600">Produits authentiques</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <RotateCcw className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-dark">Retour facile</div>
                      <div className="text-sm text-gray-600">14 jours</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tag className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-dark">Meilleur prix</div>
                      <div className="text-sm text-gray-600">Prix compétitifs</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-dark mb-4 font-display">Description</h2>
                <div className="prose max-w-none text-gray-700">
                  {product.description.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-dark mb-6 font-display">Produits Similaires</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {similarProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
