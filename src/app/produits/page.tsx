'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Loading from '@/components/Loading';
import { Product, Category } from '@/types';
import { Filter, X, ChevronDown } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isNew, setIsNew] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [isPack, setIsPack] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Get filters from URL
    const categoryParam = searchParams.get('categorie');
    const newParam = searchParams.get('nouveautes');
    const saleParam = searchParams.get('promotions');
    const packParam = searchParams.get('packs');
    const searchParam = searchParams.get('search');

    if (categoryParam) setSelectedCategory(categoryParam);
    if (newParam === 'true') setIsNew(true);
    if (saleParam === 'true') setIsOnSale(true);
    if (packParam === 'true') setIsPack(true);
    if (searchParam) setSearch(searchParam);

    // Fetch categories
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(console.error);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, isNew, isOnSale, isPack, search, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('categorySlug', selectedCategory);
      if (isNew) params.append('isNew', 'true');
      if (isOnSale) params.append('isOnSale', 'true');
      if (isPack) params.append('isPack', 'true');
      if (search) params.append('search', search);
      params.append('page', currentPage.toString());
      params.append('limit', '12');

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      
      setProducts(data.products || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setIsNew(false);
    setIsOnSale(false);
    setIsPack(false);
    setSearch('');
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedCategory || isNew || isOnSale || isPack || search;

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-dark mb-2 font-display">Nos Produits</h1>
            <p className="text-gray-600">
              Découvrez notre large gamme de compléments alimentaires sportifs
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-dark flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtres
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-primary hover:text-primary-dark"
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold text-dark mb-3">Catégories</h3>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        checked={!selectedCategory}
                        onChange={() => setSelectedCategory('')}
                        className="mr-2 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700">Toutes les catégories</span>
                    </label>
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={selectedCategory === category.slug}
                          onChange={() => setSelectedCategory(category.slug)}
                          className="mr-2 text-primary focus:ring-primary"
                        />
                        <span className="text-gray-700">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="space-y-3 border-t pt-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="mr-2 text-primary focus:ring-primary rounded"
                    />
                    <span className="text-gray-700">Nouveautés</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isOnSale}
                      onChange={(e) => setIsOnSale(e.target.checked)}
                      className="mr-2 text-primary focus:ring-primary rounded"
                    />
                    <span className="text-gray-700">Promotions</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPack}
                      onChange={(e) => setIsPack(e.target.checked)}
                      className="mr-2 text-primary focus:ring-primary rounded"
                    />
                    <span className="text-gray-700">Packs</span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden w-full bg-white rounded-lg shadow-md p-4 mb-6 flex items-center justify-center gap-2 text-dark font-medium"
              >
                <Filter className="w-5 h-5" />
                Filtres
                {hasActiveFilters && (
                  <span className="bg-primary text-white px-2 py-1 rounded-full text-xs">
                    Actifs
                  </span>
                )}
              </button>

              {loading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <Loading />
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-white rounded-lg shadow-md hover:bg-light-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Précédent
                      </button>
                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg shadow-md transition-colors ${
                              currentPage === page
                                ? 'bg-primary text-white'
                                : 'bg-white hover:bg-light-gray'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-white rounded-lg shadow-md hover:bg-light-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Filter className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-dark mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-600 mb-4">
                    Essayez de modifier vos filtres ou votre recherche
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div className="min-h-screen bg-light-gray flex items-center justify-center">
          <Loading />
        </div>
        <Footer />
      </>
    }>
      <ProductsContent />
    </Suspense>
  );
}
