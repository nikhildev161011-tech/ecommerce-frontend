'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ShoppingBag, 
  ArrowLeft, 
  Package, 
  X, 
  ShieldCheck, 
  Lock, 
  Smartphone 
} from 'lucide-react';
import { useCart } from '../../context/cartContext';
import { useAuth } from '../../context/authContext';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Online Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [onlineTab, setOnlineTab] = useState('upi');

  const subtotal = cart.reduce((total, item) => total + item.price * item.qty, 0);
  const shipping = subtotal > 1000 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  if (cart.length === 0 && !orderSuccess) {
    return (
      <div className="text-center py-20 bg-slate-900/90 border border-slate-800 rounded-2xl max-w-md mx-auto p-8 shadow-xl mt-10">
        <div className="w-14 h-14 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
          <ShoppingBag className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Your cart is empty</h2>
        <p className="text-xs text-slate-400 mb-6">Add some products to your cart before checking out.</p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/20"
        >
          <ArrowLeft className="w-4 h-4" /> Start Shopping
        </Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-slate-900/90 border border-slate-800 rounded-2xl text-center shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Order Confirmed!</h2>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Thank you for your purchase! Your payment and order details have been securely recorded.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-xs shadow-lg shadow-blue-600/20"
          >
            <Package className="w-4 h-4" /> View My Orders
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-block bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-6 py-3 rounded-xl transition-all text-xs border border-slate-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const executeOrderPlacement = async () => {
    setLoading(true);

    try {
      const orderData = {
        orderItems: cart.map((item) => ({
          product: item._id,
          name: item.name,
          qty: item.qty,
          quantity: item.qty,
          price: item.price,
          image: item.images?.[0] || '',
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        totalPrice: total,
      };

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-backend-pms7.onrender.com';
      const res = await fetch(`${backendUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setIsPaymentModalOpen(false);
      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      alert(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert('Please Sign In first to place an order!');
      router.push('/login');
      return;
    }

    if (paymentMethod === 'Online') {
      setIsPaymentModalOpen(true);
    } else {
      executeOrderPlacement();
    }
  };

  return (
    <div className="py-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cart" className="text-slate-400 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </Link>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-white mb-8 tracking-tight">
        Checkout Details
      </h1>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <MapPin className="w-4 h-4 text-blue-400" /> Shipping Information
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Street Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Tech Park, 4th Cross"
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Azamgarh / Mumbai / Delhi"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="276140"
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Country
              </label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <CreditCard className="w-4 h-4 text-blue-400" /> Payment Option
            </h2>

            <div className="space-y-3">
              <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery' ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-500 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-slate-400">Pay cash upon delivery to your doorstep</span>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'Online' ? 'bg-blue-600/10 border-blue-500/50 text-white' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}>
                <input
                  type="radio"
                  name="payment"
                  value="Online"
                  checked={paymentMethod === 'Online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-blue-500 focus:ring-0"
                />
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block text-blue-400">Online (UPI / QR / Cards / NetBanking)</span>
                  <span className="text-[11px] text-slate-400">Scan QR via Google Pay, PhonePe, Paytm or Card</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl h-fit space-y-4">
          <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">Order Summary</h2>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Items Subtotal</span>
              <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Shipping Fee</span>
              <span className="font-semibold text-white">
                {shipping === 0 ? <span className="text-emerald-400 font-bold">FREE</span> : `₹${shipping}`}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
              <span>Total Payable</span>
              <span className="text-blue-400 font-extrabold text-base">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
          >
            {loading ? 'Processing...' : paymentMethod === 'Online' ? 'Proceed to Online Payment' : 'Place Order Now'}
          </button>
        </div>
      </form>

      {/* Online Payment Popup Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">DevCart Secure Payment</h3>
                <p className="text-[11px] text-slate-400">256-Bit SSL Encrypted Transaction</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between mb-5">
              <span className="text-xs text-slate-400 font-semibold">Total Amount</span>
              <span className="text-lg font-black text-blue-400">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              <button
                type="button"
                onClick={() => setOnlineTab('upi')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  onlineTab === 'upi'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" /> UPI / QR Code
              </button>
              <button
                type="button"
                onClick={() => setOnlineTab('card')}
                className={`py-2 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${
                  onlineTab === 'card'
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Debit / Card
              </button>
            </div>

            {onlineTab === 'upi' ? (
              <div className="text-center space-y-4">
                <div className="bg-white p-3.5 rounded-2xl inline-block shadow-inner mx-auto">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=devcart@upi&pn=DevCart&am=${total}&cu=INR`}
                    alt="UPI QR Code"
                    className="w-40 h-40 mx-auto"
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-200">Scan using any UPI App</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Google Pay • PhonePe • Paytm • BHIM</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-left">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    placeholder="4532 •••• •••• 8920"
                    defaultValue="4532 8821 9012 8920"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      defaultValue="892"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={loading}
              onClick={executeOrderPlacement}
              className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              {loading ? 'Confirming Payment...' : `Simulate & Pay ₹${total.toLocaleString('en-IN')}`}
            </button>
            <p className="text-[10px] text-center text-slate-500 mt-2">Instant demo payment simulation</p>
          </div>
        </div>
      )}
    </div>
  );
}
