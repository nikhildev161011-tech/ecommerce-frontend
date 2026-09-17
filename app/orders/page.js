'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle, ArrowLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/authContext';

export default function MyOrdersPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user, token, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Fetching your orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20 bg-slate-900/80 border border-slate-800 rounded-3xl max-w-md mx-auto p-8 shadow-xl mt-10">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-white mb-2">Please Sign In</h2>
        <p className="text-xs text-slate-400 mb-6">You need to be logged in to view your orders history.</p>
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-blue-600/20"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6">
      <div className="mb-6">
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-blue-500/80 text-slate-200 hover:text-white transition-all font-semibold text-xs uppercase tracking-wider shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-blue-400 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Store</span>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Orders
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track and view details of all your previous purchases
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300">
          Total Orders: <span className="text-blue-400 font-bold">{orders.length}</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/90 rounded-3xl border border-slate-800 p-8 shadow-xl max-w-md mx-auto">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No orders placed yet</h3>
          <p className="text-xs text-slate-400 mb-6">You haven't ordered anything yet. Explore our collection and grab your favorite gadgets!</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-xs shadow-md shadow-blue-500/20"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700/80 transition-all"
            >
              {/* Order Header */}
              <div className="bg-slate-950/70 px-6 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px] font-semibold">Order ID</span>
                  <span className="font-mono font-bold text-slate-200">#{order._id.substring(order._id.length - 8).toUpperCase()}</span>
                </div>

                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px] font-semibold">Date Placed</span>
                  <span className="text-slate-300 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px] font-semibold">Total Paid</span>
                  <span className="font-black text-blue-400 text-sm">
                    ₹{order.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 uppercase tracking-wider block text-[10px] font-semibold mb-1">Status</span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                    order.isDelivered 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {order.isDelivered ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {order.isDelivered ? 'Delivered' : 'Processing'}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 divide-y divide-slate-800/60">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-14 h-14 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800">
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Quantity: <strong className="text-slate-200">{item.qty}</strong></p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-slate-200 text-sm">
                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-slate-500">
                        (₹{item.price.toLocaleString('en-IN')} each)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address Summary */}
              <div className="bg-slate-950/40 px-6 py-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-slate-500 font-semibold">Delivery To: </span>
                  <span>{order.shippingAddress.address}, {order.shippingAddress.city} ({order.shippingAddress.postalCode})</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Payment: </span>
                  <span className="text-slate-300 font-medium">{order.paymentMethod}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}