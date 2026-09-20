'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../../context/cartContext';
import { ShoppingBag, ArrowLeft, Check } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-backend-pms7.onrender.com';
        const res = await fetch(`${backendUrl}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Loading gadget details...</p>
      </div>
    );
  }

  if (!product || product.message) {
    return (
      <div className="text-center py-20 bg-slate-900/80 border border-slate-800 rounded-3xl max-w-md mx-auto p-8 shadow-xl mt-10">
        <h2 className="text-xl font-bold text-red-400 mb-2">Product Not Found!</h2>
        <p className="text-xs text-slate-400 mb-6">The item you are looking for does not exist or has been removed.</p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-6">
      
      {/* Highlighted Back Button */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-blue-500/80 text-slate-100 hover:text-white shadow-lg shadow-black/40 hover:shadow-blue-500/10 transition-all font-semibold text-xs uppercase tracking-wider"
        >
          <div className="w-6 h-6 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-400">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center backdrop-blur-xl">
        
        {/* Product Image */}
        <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          <Image
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-widest text-blue-400 font-extrabold mb-2">
            {product.category}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
            {product.name}
          </h1>
          <p className="text-3xl font-black text-blue-400 mb-4">
            ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
          </p>
          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="mb-8 flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">Availability:</span>
            <span className={`text-xs px-3 py-1 rounded-full font-bold ${product.stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-white text-sm transition-all shadow-lg ${
              added 
                ? 'bg-emerald-600 shadow-emerald-600/30' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/25'
            } disabled:bg-slate-800 disabled:text-slate-500`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
