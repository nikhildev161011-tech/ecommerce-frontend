'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Eye, Sparkles, Search, RotateCcw, RefreshCw } from 'lucide-react';
import { useCart } from '../context/cartContext';

const CATEGORIES = ['All', 'Audio', 'Smartphones', 'Wearables', 'Gaming', 'Laptops', 'Displays', 'Accessories', 'Gadgets'];

function ProductContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = search.toLowerCase();
    const matchesSearch = !search || (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8 pt-3 sm:pt-4 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 p-6 sm:p-12 border border-slate-800/80 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-bold tracking-wide uppercase mb-3 sm:mb-4">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
            Everything in One Place
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-2 sm:mb-3">
            Discover What <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Moves You</span>
          </h1>
          <p className="text-xs sm:text-base text-slate-300 font-medium leading-relaxed">
            Your one-stop destination for premium tech, flagship gadgets, workspace tools, and creator gear.
          </p>
        </div>

        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Search Badge */}
      {search && (
        <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-md text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Search className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-none">Search: <strong className="text-white">"{search}"</strong></span>
            <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold border border-blue-500/20">
              {filteredProducts.length}
            </span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg"
          >
            <RotateCcw className="w-3 h-3" /> Clear
          </Link>
        </div>
      )}

      {/* Products Grid: 2 Columns on Mobile, 4 Columns on Desktop */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs sm:text-sm text-slate-400 font-medium">Loading collection...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/80 border border-slate-800 rounded-3xl max-w-md mx-auto p-6 sm:p-8 shadow-xl">
          <Search className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base sm:text-lg font-bold text-white mb-1">No products found</h3>
          <p className="text-xs text-slate-400 mb-5">Try picking another category or clear your search.</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="bg-blue-600 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20"
          >
            View All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between"
            >
              {/* Product Image */}
              <div className="relative w-full h-36 sm:h-52 bg-slate-950 overflow-hidden">
                <Image
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                  alt={product.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-slate-950/85 backdrop-blur-md text-blue-400 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-slate-800 uppercase tracking-wider">
                  {product.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-bold text-white text-xs sm:text-base leading-snug line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-1 sm:mt-2 line-clamp-1 sm:line-clamp-2 leading-relaxed hidden xs:block">
                    {product.description}
                  </p>
                </div>

                {/* Price & Action Buttons */}
                <div className="mt-3 sm:mt-5 pt-2 sm:pt-4 border-t border-slate-800/80 flex items-center justify-between gap-1">
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider block font-semibold leading-none mb-0.5">Price</span>
                    <span className="text-xs sm:text-lg font-black text-white whitespace-nowrap">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <Link
                      href={`/product/${product._id}`}
                      className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>

                    <button
                      onClick={() => addToCart(product, 1)}
                      className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] sm:text-xs transition-colors shadow-md shadow-blue-600/20"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading DevCart...</div>}>
      <ProductContent />
    </Suspense>
  );
}