import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ProductsPageProps {
  products: Product[];
  onOpenLightbox: (imageUrl: string, title: string) => void;
  onViewDetails: (product: Product) => void;
  onOrderNow: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  onOpenLightbox,
  onViewDetails,
  onOrderNow
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Women' | 'Boys/Men'>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Visibility check
      if (!p.visibility) return false;

      // Category check
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // In stock check
      if (inStockOnly && p.stock <= 0) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(term);
        const matchesDesc = (p.description || '').toLowerCase().includes(term);
        const matchesCategory = p.category.toLowerCase().includes(term);
        if (!matchesName && !matchesDesc && !matchesCategory) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, selectedCategory, sortBy, inStockOnly, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#0E7490]">
          SAMIA’S CLOSET CATALOG
        </span>
        <h1 className="font-brand text-3xl sm:text-4xl font-bold text-gray-900">
          The Luxury Clothing Collection
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Hand-inspected festive suits, silks, and tailored panjabis for Women &amp; Boys/Men.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search silk kurti, anarkali, cotton panjabi..."
              className="w-full pl-10 pr-9 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E7490] focus:border-transparent outline-none bg-gray-50 focus:bg-white"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0E7490] focus:border-transparent outline-none bg-gray-50 focus:bg-white font-medium"
            >
              <option value="default">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Product Name (A-Z)</option>
            </select>
          </div>

          {/* In Stock Toggle */}
          <div className="md:col-span-3 flex items-center justify-end gap-2 text-xs text-gray-700">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-[#0E7490] rounded focus:ring-[#0E7490] border-gray-300"
              />
              <span className="font-semibold">In Stock Only</span>
            </label>
          </div>

        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2">
            Category:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#0E7490] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Items ({products.filter((p) => p.visibility).length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('Women')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === 'Women'
                ? 'bg-[#0E7490] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Women ({products.filter((p) => p.category === 'Women' && p.visibility).length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('Boys/Men')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedCategory === 'Boys/Men'
                ? 'bg-[#0E7490] text-white shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Boys / Men ({products.filter((p) => p.category === 'Boys/Men' && p.visibility).length})
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300 space-y-3">
          <p className="text-4xl">🛍️</p>
          <h3 className="font-brand text-lg font-bold text-gray-800">No matching products found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try adjusting your search query, clearing filters, or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setInStockOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-[#0E7490] text-white text-xs font-bold uppercase tracking-wider mt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenLightbox={onOpenLightbox}
              onViewDetails={onViewDetails}
              onOrderNow={onOrderNow}
            />
          ))}
        </div>
      )}

    </div>
  );
};
