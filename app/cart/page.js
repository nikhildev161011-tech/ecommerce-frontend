'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../context/cartContext';
import { Trash2, ArrowLeft, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart } = useCart();

  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-900/90 rounded-3xl border border-slate-800 mt-6 max-w-md mx-auto p-8 shadow-xl">
        <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Your Cart is Empty</h2>
        <p className="text-slate-400 mb-6 text-xs">Looks like you haven't added any gadgets yet.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-xs shadow-md shadow-blue-500/20"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-blue-500/80 text-slate-200 hover:text-white transition-all font-semibold text-xs uppercase tracking-wider shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-400 group-hover:-translate-x-1 transition-transform" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-white mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg hover:border-slate-700 transition-all"
            >
              <div className="relative w-20 h-20 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800">
                <Image
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                  alt={item.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="flex-grow">
                <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">{item.name}</h3>
                <p className="text-[11px] text-blue-400 mt-0.5 uppercase tracking-wider font-semibold">{item.category}</p>
                
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-lg font-semibold border border-slate-700">
                    Qty: {item.qty}
                  </span>
                  <span className="text-xs text-slate-400">
                    ₹{item.price.toLocaleString('en-IN')} each
                  </span>
                </div>
              </div>

              {/* Total Price for this item */}
              <div className="text-right flex flex-col items-end gap-2">
                <span className="font-black text-white text-base sm:text-lg">
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </span>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-400 hover:text-red-300 p-2 rounded-xl hover:bg-red-500/10 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 text-xs text-slate-400 pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Secure checkout with encrypted transaction</span>
          </div>
        </div>

        {/* Order Summary (Bill) */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl h-fit space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Order Summary</h2>
          
          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-slate-400">Shipping Fee</span>
              <span className="font-bold text-white">
                {shipping === 0 ? (
                  <span className="text-emerald-400">FREE</span>
                ) : (
                  `₹${shipping}`
                )}
              </span>
            </div>

            {shipping > 0 && (
              <p className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg">
                Add items worth ₹{(1000 - subtotal).toLocaleString('en-IN')} more for FREE delivery!
              </p>
            )}

            <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-extrabold text-white">
              <span>Grand Total</span>
              <span className="text-blue-400 text-lg">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full block text-center mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-xs uppercase tracking-wider"
          >
            Proceed to Checkout
          </Link>
        </div>

      </div>
    </div>
  );
}