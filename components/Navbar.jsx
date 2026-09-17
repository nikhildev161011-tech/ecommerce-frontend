'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  Flame, 
  Layers, 
  ShoppingBag, 
  LogOut, 
  XCircle, 
  Package, 
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = cart.reduce((total, item) => total + item.qty, 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
    setMobileMenuOpen(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    router.push('/');
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <Link 
            href="/" 
            onClick={() => { setSearchQuery(''); setMobileMenuOpen(false); }} 
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
              Dev<span className="text-blue-500">Cart</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <Link href="/" onClick={() => setSearchQuery('')} className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors">
              Explore
            </Link>
            <Link href="/" onClick={() => setSearchQuery('')} className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-1.5 transition-colors">
              <Layers className="w-4 h-4 text-blue-400" />
              Categories
            </Link>
            <Link href="/" onClick={() => setSearchQuery('')} className="px-3 py-1.5 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 flex items-center gap-1.5 transition-colors font-semibold">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              Hot Deals
            </Link>
          </nav>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2">
            <div className="relative w-full">
              <button type="submit" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 transition-colors">
                <Search className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gadgets, brands..."
                className="w-full bg-slate-900/80 text-xs text-slate-100 placeholder-slate-400 pl-9 pr-8 py-2 rounded-xl border border-slate-700/70 focus:outline-none focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button type="button" onClick={handleClear} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Right Area */}
          <div className="flex items-center gap-2">
            {/* Cart Button (Always visible) */}
            <Link 
              href="/cart" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/60 hover:border-slate-600 text-slate-200 hover:text-white transition-all relative"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                {itemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-blue-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-slate-950">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold hidden md:inline">Cart</span>
            </Link>

            {/* Desktop Only Buttons (Hidden on mobile) */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600/10 border border-indigo-500/30 hover:bg-indigo-600/20 text-indigo-300 hover:text-white text-xs font-bold transition-all whitespace-nowrap"
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  <span>Admin</span>
                </Link>

                <Link
                  href="/orders"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-blue-500/60 text-slate-200 hover:text-white text-xs font-semibold transition-all whitespace-nowrap"
                  title="View My Orders"
                >
                  <Package className="w-4 h-4 text-blue-400" />
                  <span>Orders</span>
                </Link>

                <div className="text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                  <User className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </div>

                <button
                  onClick={logout}
                  title="Logout"
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2.5 py-2 rounded-xl text-xs font-semibold border border-red-500/20 transition-colors flex-shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="hidden md:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md shadow-blue-600/20"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-blue-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/98 border-b border-slate-800 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gadgets, brands..."
              className="w-full bg-slate-900 text-xs text-white placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500"
            />
          </form>

          {user ? (
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white text-xs font-bold whitespace-nowrap">{user.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate max-w-[170px]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 bg-red-500/10 p-2 rounded-xl border border-red-500/20"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-slate-950 border border-slate-800 hover:border-blue-500 text-slate-200 py-2 px-3 rounded-xl text-xs font-semibold transition-colors"
                >
                  <Package className="w-4 h-4 text-blue-400" />
                  <span>My Orders</span>
                </Link>

                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-indigo-600/10 border border-indigo-500/30 hover:bg-indigo-600/20 text-indigo-300 py-2 px-3 rounded-xl text-xs font-bold transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                  <span>Admin</span>
                </Link>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/20"
            >
              <User className="w-4 h-4" />
              <span>Sign In to Account</span>
            </Link>
          )}

          <div className="space-y-1 pt-1 text-xs font-semibold">
            <Link
              href="/"
              onClick={() => { setSearchQuery(''); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-blue-400" /> Explore Store
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </Link>

            <Link
              href="/"
              onClick={() => { setSearchQuery(''); setMobileMenuOpen(false); }}
              className="flex items-center justify-between p-2.5 rounded-xl text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <span className="flex items-center gap-2.5 font-bold">
                <Flame className="w-4 h-4 text-amber-400" /> Hot Deals & Offers
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}