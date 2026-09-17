'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Package, 
  ArrowLeft,
  Truck,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/authContext';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'products'
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    async function fetchAdminData() {
      try {
        // Fetch All Orders
        const ordersRes = await fetch('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await ordersRes.json();
        if (ordersRes.ok) setOrders(ordersData);

        // Fetch All Products
        const prodRes = await fetch('http://localhost:5000/api/products');
        const prodData = await prodRes.json();
        if (prodRes.ok) setProducts(prodData);
      } catch (err) {
        console.error('Admin fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminData();
  }, [token, router]);

  // Mark Order As Delivered
  const handleMarkDelivered = async (orderId) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, isDelivered: true } : o))
        );
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Calculations for Stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalDelivered = orders.filter((o) => o.isDelivered).length;
  const totalPending = orders.length - totalDelivered;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-slate-400 font-medium">Loading Admin Panel...</p>
      </div>
    );
  }

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" /> Store Manager
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track revenue, manage all customer shipments, and monitor product catalog
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>
      </div>

      {/* 4 Analytics Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">Total Revenue</span>
            <span className="text-2xl font-black text-white mt-1 block">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">Total Orders</span>
            <span className="text-2xl font-black text-white mt-1 block">{orders.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Deliveries */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">In Processing</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">{totalPending}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">Catalog Items</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">{products.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Truck className="w-4 h-4" /> Customer Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" /> Products Catalog ({products.length})
        </button>
      </div>

      {/* TAB 1: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/90 rounded-2xl border border-slate-800 text-slate-400 text-xs">
              No orders received yet.
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-slate-700 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-slate-500 uppercase font-semibold text-[10px] block">Order ID</span>
                    <span className="font-mono font-bold text-white">
                      #{order._id.substring(order._id.length - 8).toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase font-semibold text-[10px] block">Customer</span>
                    <span className="font-semibold text-slate-200">
                      {order.user?.name || 'Customer'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase font-semibold text-[10px] block">Date</span>
                    <span className="text-slate-300">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase font-semibold text-[10px] block">Payment Mode</span>
                    <span className="text-slate-200 font-semibold">{order.paymentMethod}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase font-semibold text-[10px] block">Total Bill</span>
                    <span className="text-blue-400 font-black text-sm">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Delivery Status & Action */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                        order.isDelivered
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {order.isDelivered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      {order.isDelivered ? 'Delivered' : 'In Processing'}
                    </span>

                    {!order.isDelivered && (
                      <button
                        onClick={() => handleMarkDelivered(order._id)}
                        disabled={updatingId === order._id}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-[11px] transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                      >
                        {updatingId === order._id ? 'Updating...' : 'Mark Delivered'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Items in this order */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  {order.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="font-semibold text-slate-200 line-clamp-1 max-w-[150px]">{item.name}</span>
                      <span className="text-blue-400 font-bold">x{item.qty || item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Address info */}
                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-500 font-semibold">Shipping Address: </span>
                  {order.shippingAddress?.address}, {order.shippingAddress?.city} ({order.shippingAddress?.postalCode}), {order.shippingAddress?.country}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Products Catalog */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p._id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex gap-3 items-center">
              <div className="relative w-14 h-14 bg-slate-950 rounded-xl overflow-hidden flex-shrink-0 border border-slate-800">
                <Image src={p.images?.[0] || ''} alt={p.name} fill unoptimized className="object-cover" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-white text-xs font-bold truncate">{p.name}</h4>
                <p className="text-[10px] text-blue-400 font-semibold uppercase mt-0.5">{p.category}</p>
                <p className="text-xs font-black text-white mt-1">₹{p.price.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}