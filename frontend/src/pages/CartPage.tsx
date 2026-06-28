import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { getProductImage } from '../utils/imageHelper';

// ─── CART PAGE ───────────────────────────────────────────────────────────────
export const CartPage = () => {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Header />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="text-xl font-black uppercase tracking-wider text-neutral-900 mb-8">Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded border border-neutral-200">
            <p className="text-5xl mb-4 font-normal">🛒</p>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">Your cart is empty</p>
            <Link 
              to="/products" 
              className="mt-6 inline-block bg-black hover:bg-neutral-850 text-white px-8 py-3 rounded text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item._id} className="bg-white rounded p-4 border border-neutral-200 flex items-center gap-4">
                  <div className="w-16 h-16 bg-neutral-100 rounded border border-neutral-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img 
                      src={item.image || getProductImage(item)} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-neutral-900 text-xs truncate uppercase tracking-tight">{item.name}</p>
                    <p className="text-neutral-900 text-xs font-black mt-1">Rs. {item.price.toLocaleString()}/{item.unit}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                      className="w-7 h-7 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 rounded text-xs font-black transition-colors"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                      className="w-7 h-7 bg-neutral-100 hover:bg-neutral-200 text-neutral-850 rounded text-xs font-black transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-neutral-900 text-xs">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      className="text-neutral-450 hover:text-black text-[10px] font-bold uppercase tracking-wider mt-1 block"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <div className="bg-white rounded border border-neutral-200 p-6 sticky top-24">
                <h3 className="font-black text-xs uppercase tracking-wider text-neutral-900 mb-4">Order Summary</h3>
                <div className="space-y-2.5 text-xs mb-6">
                  <div className="flex justify-between text-neutral-500 font-semibold"><span>Subtotal</span><span>Rs. {total.toLocaleString()}</span></div>
                  <div className="flex justify-between text-neutral-500 font-semibold"><span>Delivery</span><span className="text-neutral-800 uppercase font-bold text-[10px] tracking-wider">To be quoted</span></div>
                  <div className="border-t border-neutral-250 pt-2.5 flex justify-between font-black text-neutral-900"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
                </div>
                <Link 
                  to="/checkout" 
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-bold text-xs uppercase tracking-wider py-3.5 rounded-lg transition-all shadow"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

// ─── CHECKOUT PAGE ───────────────────────────────────────────────────────────
type PaymentMethod = 'easypaisa' | 'hbl';

export const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ street: '', city: '', state: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('easypaisa');
  const [senderInfo, setSenderInfo] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<any>(null);

  const EASYPAISA_NUMBER = '03323884785'; // Malik Zameer
  const HBL_TITLE = 'Arain Iron Store';
  const HBL_ACCOUNT = '00427992039403';
  const HBL_IBAN = 'PK73HABB000427992039403';

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderInfo.trim()) {
      alert(paymentMethod === 'easypaisa' ? 'Please enter your EasyPaisa sender mobile number.' : 'Please enter your HBL sender account name or transaction ID.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        items: items.map(i => ({ product: i._id, quantity: i.quantity })),
        shippingAddress: form,
        totalAmount: total,
        paymentStatus: 'unpaid',
        paymentMethod: paymentMethod,
        notes: `Payment method: ${paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'HBL Bank Transfer'}. Sender Info: ${senderInfo}. Notes: ${notes}`
      });
      setOrderPlaced(res.data.data);
      clearCart();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-8 text-center shadow-sm">
          <p className="text-5xl mb-4">✅</p>
          <h2 className="text-xl font-black uppercase tracking-wider text-gray-900 dark:text-white mb-2">Order Placed!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Order: <strong className="text-gray-800 dark:text-white font-mono">{orderPlaced.orderNumber}</strong></p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Total: <strong className="text-gray-800 dark:text-white">Rs. {total.toLocaleString()}</strong></p>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5 text-left mb-6">
            <p className="font-bold text-green-800 dark:text-green-300 text-sm mb-3">
              {paymentMethod === 'easypaisa' ? '📱 EasyPaisa' : '🏦 HBL Bank Transfer'} Payment Instructions
            </p>
            <div className="text-green-700 dark:text-green-400 text-xs leading-relaxed space-y-2">
              <p>✅ Your order is received. Please transfer <strong>Rs. {total.toLocaleString()}</strong> to:</p>
              
              {paymentMethod === 'easypaisa' ? (
                <>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3 font-mono font-bold text-gray-800 dark:text-white text-center text-lg">
                    {EASYPAISA_NUMBER}
                  </div>
                  <p>Account Title: <strong>Malik Zameer (EasyPaisa Merchant Account)</strong></p>
                </>
              ) : (
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-gray-800 dark:text-white space-y-1 font-semibold text-xs border border-gray-150 dark:border-gray-600">
                  <p>Bank: <strong className="font-bold text-gray-900 dark:text-white">Habib Bank Limited (HBL)</strong></p>
                  <p>Account Title: <strong className="font-bold text-gray-900 dark:text-white">{HBL_TITLE}</strong></p>
                  <p>Account Number: <strong className="font-mono text-gray-900 dark:text-white">{HBL_ACCOUNT}</strong></p>
                  <p>IBAN: <strong className="font-mono text-[10px] text-gray-900 dark:text-white">{HBL_IBAN}</strong></p>
                </div>
              )}
              
              <p className="mt-2">After transferring, please share a <strong>screenshot of the transaction receipt</strong> on WhatsApp to confirm your payment.</p>
            </div>
            
            <a
              href={`https://wa.me/923323884785?text=Assalam%20o%20Alaikum!%20I%20have%20sent%20Rs.%20${total}%20via%20${paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'HBL'}%20for%20Order%20${orderPlaced.orderNumber}.%20Sender%20Info:%20${senderInfo}.%20Please%20verify%20receipt.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-lg w-full transition-colors"
            >
              💬 Share Payment Screenshot on WhatsApp
            </a>
          </div>

          <button onClick={() => navigate('/orders')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-lg transition-colors">
            View My Orders
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="text-xl font-black uppercase tracking-wider text-gray-900 dark:text-white mb-8">Checkout</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleOrder} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-4">1. Shipping Information</h3>
              <div className="space-y-4">
                {[
                  { key: 'street', label: 'Street Address', placeholder: '123 Main Street, Vehova', max: 250 },
                  { key: 'city', label: 'City', placeholder: 'Vehova', max: 100 },
                  { key: 'state', label: 'Province', placeholder: 'Punjab', max: 100 },
                  { key: 'phone', label: 'Contact Phone', placeholder: '0300 1234567', max: 20 },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">{f.label}</label>
                    <input 
                      type="text" 
                      required 
                      maxLength={f.max}
                      placeholder={f.placeholder} 
                      value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-4">2. Select Payment Method</h3>
              <div className="space-y-3">
                {[
                  { id: 'easypaisa', label: 'EasyPaisa Transfer', desc: `Send to ${EASYPAISA_NUMBER} (Malik Zameer Merchant Account)`, icon: '📱' },
                  { id: 'hbl', label: 'HBL Business Account', desc: 'Transfer to Arain Iron Store HBL Account', icon: '🏦' },
                ].map(opt => (
                  <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === opt.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-250 dark:border-gray-700 hover:border-blue-300'}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={opt.id} 
                      checked={paymentMethod === opt.id} 
                      onChange={() => {
                        setPaymentMethod(opt.id as PaymentMethod);
                        setSenderInfo('');
                      }} 
                      className="accent-blue-650" 
                    />
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wide">{opt.label}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-[10px] mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4 space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="font-bold text-blue-800 dark:text-blue-300 text-xs mb-1">📋 Transfer Details</p>
                  
                  {paymentMethod === 'easypaisa' ? (
                    <p className="text-blue-700 dark:text-blue-400 text-[11px] leading-relaxed">
                      Please send <strong>Rs. {total.toLocaleString()}</strong> to EasyPaisa Account number:{' '}
                      <strong className="font-mono text-sm block my-1 text-gray-900 dark:text-white">{EASYPAISA_NUMBER}</strong>
                      (Title: <strong>Malik Zameer - EasyPaisa Merchant Account</strong>)
                    </p>
                  ) : (
                    <div className="text-blue-700 dark:text-blue-400 text-[11px] leading-relaxed space-y-1">
                      <p>Please transfer <strong>Rs. {total.toLocaleString()}</strong> to HBL Business Account:</p>
                      <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg text-gray-900 dark:text-white space-y-0.5 font-mono text-[10px]">
                        <p>Bank: Habib Bank Limited (HBL)</p>
                        <p>Title: {HBL_TITLE}</p>
                        <p>A/C #: {HBL_ACCOUNT}</p>
                        <p>IBAN: {HBL_IBAN}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">
                    {paymentMethod === 'easypaisa' 
                      ? 'Your EasyPaisa Mobile Number *' 
                      : 'Your Sender Account Title / Transaction ID *'}
                  </label>
                  <input 
                    type="text"
                    required
                    maxLength={100}
                    placeholder={paymentMethod === 'easypaisa' ? 'e.g. 03001234567' : 'e.g. Muhammad Ali / Txn 72893'}
                    value={senderInfo}
                    onChange={e => setSenderInfo(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Order Notes (Optional)</label>
                <textarea
                  maxLength={500}
                  rows={2}
                  placeholder="Any delivery details or instructions..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || items.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold uppercase tracking-wider text-xs py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              {loading ? 'Placing Order...' : `Place Order — Rs. ${total.toLocaleString()}`}
            </button>
          </form>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-150 dark:border-gray-700 p-6 shadow-sm h-fit sticky top-24">
            <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map(i => (
                <div key={i._id} className="flex justify-between text-xs py-2 border-b border-gray-50 dark:border-gray-700">
                  <span className="text-gray-700 dark:text-gray-300 font-bold uppercase">{i.name} <span className="text-gray-400 font-normal">× {i.quantity}</span></span>
                  <span className="font-black text-gray-900 dark:text-white">Rs. {(i.price * i.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-black text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
              <span>Total Amount</span><span>Rs. {total.toLocaleString()}</span>
            </div>
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase">⚠️ Important Note</p>
              <p className="text-amber-600 dark:text-amber-500 text-[10px] mt-1 leading-relaxed">
                Your order is placed as "Unpaid" until the store admin verifies the bank or EasyPaisa transfer. Please send the payment screenshot on WhatsApp as soon as the transfer is done.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────
export const OrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    pending: 'border border-neutral-300 text-neutral-500',
    confirmed: 'border border-black bg-black text-white font-bold',
    delivered: 'bg-neutral-100 text-neutral-800 border border-neutral-200',
    cancelled: 'line-through text-neutral-400 bg-neutral-50 border border-neutral-200',
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Header />
      <div className="flex-1 max-w-4xl mx-auto px-4 py-10 w-full">
        <h1 className="text-xl font-black uppercase tracking-wider text-neutral-900 mb-8">My Orders</h1>
        {loading ? (
          <div className="text-center py-20 text-xs uppercase tracking-widest text-neutral-450 font-bold">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded border border-neutral-200">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider">No orders placed yet</p>
            <Link 
              to="/products" 
              className="mt-6 inline-block bg-black text-white px-8 py-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-neutral-850 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o: any) => (
              <div key={o._id} className="bg-white rounded border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-black text-xs text-neutral-900 uppercase tracking-wider">#{o.orderNumber}</p>
                    <p className="text-[10px] font-bold text-neutral-400 mt-1">{new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-[9px] uppercase tracking-wider px-3 py-1 rounded font-bold ${statusColors[o.status] || 'bg-neutral-100 text-neutral-600'}`}>
                    {o.status}
                  </span>
                </div>
                <div className="space-y-2.5 text-xs text-neutral-600 mb-4 border-t border-neutral-100 pt-3">
                  {o.items.slice(0, 3).map((i: any) => (
                    <p key={i._id} className="font-bold text-neutral-800 uppercase">
                      {i.name} <span className="text-neutral-400 font-normal">× {i.quantity}</span>
                    </p>
                  ))}
                  {o.items.length > 3 && <p className="text-[10px] text-neutral-450 uppercase font-bold">+{o.items.length - 3} more items</p>}
                </div>
                <div className="flex justify-between items-center border-t border-neutral-100 pt-3.5">
                  <span className="font-black text-neutral-900 text-xs">Rs. {o.totalAmount.toLocaleString()}</span>
                  <span className={`text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded font-black border ${o.paymentStatus === 'paid' ? 'text-neutral-900 bg-neutral-100 border-neutral-300' : 'text-neutral-400 bg-white border-neutral-250'}`}>
                    {o.paymentStatus === 'paid' ? 'PAID - ONLINE' : 'UNPAID'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

// ─── PRODUCT DETAIL PAGE ──────────────────────────────────────────────────────
export const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-neutral-50">
      <div className="w-8 h-8 border-2 border-neutral-450 border-t-black rounded-full animate-spin"></div>
    </div>
  );
  if (!product) return <div className="text-center py-20 text-xs uppercase tracking-widest font-bold">Product not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      <Header />
      <div className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-white rounded overflow-hidden h-[450px] border border-neutral-200">
            <img 
              src={product.images?.[0] || getProductImage(product)} 
              alt={product.name} 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2">{product.category?.name}</p>
            <h1 className="text-2xl font-black uppercase text-neutral-900 mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-baseline gap-2 mb-6 border-b border-neutral-200 pb-4">
              <span className="text-xl font-black text-neutral-900">Rs. {product.price.toLocaleString()}</span>
              <span className="text-[10px] text-neutral-450 font-bold uppercase">/{product.unit}</span>
            </div>
            {product.description && (
              <p className="text-neutral-500 text-xs leading-relaxed mb-6 font-medium">
                {product.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4 mb-8 text-[10px] uppercase font-bold tracking-wider">
              <div className="bg-white border border-neutral-200 rounded p-3">
                <span className="text-neutral-400">Quality: </span>
                <span className="text-neutral-850">{product.qualityLevel}</span>
              </div>
              <div className="bg-white border border-neutral-200 rounded p-3">
                <span className="text-neutral-400">Stock: </span>
                <span className={product.stock > 0 ? 'text-black font-extrabold' : 'text-neutral-350 line-through'}>
                  {product.stock > 0 ? `${product.stock} units` : 'Out of stock'}
                </span>
              </div>
              {product.brand && (
                <div className="bg-white border border-neutral-200 rounded p-3">
                  <span className="text-neutral-400">Brand: </span>
                  <span className="text-neutral-850">{product.brand}</span>
                </div>
              )}
              {product.sku && (
                <div className="bg-white border border-neutral-200 rounded p-3">
                  <span className="text-neutral-400">SKU: </span>
                  <span className="text-neutral-805 font-mono">{product.sku}</span>
                </div>
              )}
            </div>
            <button 
              onClick={() => addToCart(product)} 
              disabled={product.stock === 0}
              className="w-full bg-black hover:bg-neutral-950 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white font-bold uppercase tracking-wider text-xs py-4 rounded text-center transition-all mb-4"
            >
              Add to Cart
            </button>
            <a 
              href="https://wa.me/923320074326" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full block text-center bg-neutral-900 border border-neutral-800 text-white hover:bg-white hover:text-black hover:border-white font-bold uppercase tracking-wider text-xs py-3.5 rounded transition-all"
            >
              💬 Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
