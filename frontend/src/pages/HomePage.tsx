import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductCard from '../components/products/ProductCard';
import api from '../utils/api';

const CATEGORIES = [
  { name: 'Iron Materials', icon: '🔩', desc: 'TR, Girder, Saria, Angle' },
  { name: 'Cement', icon: '🏗️', desc: 'DG Cement, Pak Cement' },
  { name: 'Bricks', icon: '🧱', desc: '3 inch, Tissue & more' },
  { name: 'Paint', icon: '🎨', desc: 'Distemper, Weather Sheet' },
  { name: 'Pipes', icon: '🪛', desc: 'Plastic, Tube well pipes' },
  { name: 'Doors', icon: '🚪', desc: 'Iron gates, Room doors' },
  { name: 'Windows', icon: '🪟', desc: 'Iron, Glass protection' },
  { name: 'Bathroom', icon: '🚽', desc: 'Western & Indian toilets' },
  { name: 'Bamboo', icon: '🎋', desc: 'Bamboo & Stairs' },
  { name: 'Tools', icon: '🔧', desc: 'Hand trolley & more' },
  { name: 'Concrete', icon: '🪨', desc: 'Zero number, Bari & grades' },
  { name: 'Other Items', icon: '📦', desc: 'Hardware, Nails, Wire' },
];

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} className={`text-base ${s <= rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`}>★</span>
    ))}
  </div>
);

const HomePage = () => {
  const [featured, setFeatured] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get('/products?featured=true&limit=8').then(r => setFeatured(r.data.data)).catch(() => {});
    api.get('/reviews?general=true').then(r => setReviews(r.data.data)).catch(() => {});
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/reviews', { ...reviewForm, isGeneral: true });
      setSubmitted(true);
      setReviewForm({ name: '', rating: 5, comment: '' });
    } catch { alert('Please login to submit a review.'); }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950">
        {/* Background image with grayscale filter to remove blue color */}
        <img 
          src="/images/home_page_hero.png" 
          alt="Structural Steel girders background" 
          className="absolute inset-0 w-full h-full object-cover opacity-35 grayscale" 
        />
        {/* Grayish transparent overlay for clean text legibility */}
        <div className="absolute inset-0 bg-black/65 z-10" />

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-6">
            <span className="text-zinc-200 text-xs font-bold uppercase tracking-[0.2em]">🏗️ Trusted Since 1998</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-none uppercase tracking-wide drop-shadow-lg">
            Arain Iron Store<br />
            <span className="text-zinc-300 font-light lowercase text-3xl md:text-4xl">Vehova</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-200 mb-10 max-w-xl mx-auto uppercase tracking-[0.15em] leading-relaxed">
            Quality Construction Materials You Can Trust Since 1998
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="bg-white hover:bg-gray-100 text-gray-900 font-extrabold uppercase tracking-wider px-8 py-4 rounded-xl text-xs transition-all shadow-lg hover:-translate-y-0.5">
              Browse Catalog
            </Link>
            <a href="https://wa.me/923320074326" target="_blank" rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-extrabold uppercase tracking-wider px-8 py-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5">
              💬 WhatsApp Us
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto border-t border-white/20 pt-8">
            {[['25+', 'Years Experience'], ['500+', 'Products'], ['1000+', 'Happy Customers']].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black text-white">{num}</p>
                <p className="text-zinc-300 text-[10px] uppercase tracking-wider font-semibold mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-5 h-9 border-2 border-white/40 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-black uppercase tracking-wider text-gray-900 dark:text-white">Product Categories</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-2">Everything you need for construction in one place</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <Link key={cat.name} to={`/products?search=${cat.name}`}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 text-center border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wider group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all mt-2">{cat.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 leading-snug font-medium">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-wider text-gray-900 dark:text-white">Featured Products</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-2">Our most popular construction materials</p>
              </div>
              <Link to="/products" className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-xs uppercase tracking-wider">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-black uppercase tracking-wider text-gray-900 dark:text-white">Customer Reviews</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-2">What our customers say about us</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {reviews.length === 0 ? (
              [
                { name: 'Muhammad Ali', rating: 5, comment: 'Best quality iron materials at very competitive prices. Highly recommended!' },
                { name: 'Ahmed Khan', rating: 5, comment: 'Trusted shop since years. DG cement always available and fresh stock.' },
                { name: 'Raza Brothers', rating: 4, comment: 'Good service and delivery on time. Will definitely buy again.' },
              ].map((r, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                  <StarRating rating={r.rating} />
                  <p className="text-gray-600 dark:text-gray-300 mt-3 text-xs leading-relaxed font-medium">"{r.comment}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">{r.name[0]}</div>
                    <span className="font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wide">{r.name}</span>
                  </div>
                </div>
              ))
            ) : reviews.map((r: any) => (
              <div key={r._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <StarRating rating={r.rating} />
                <p className="text-gray-600 dark:text-gray-300 mt-3 text-xs leading-relaxed font-medium">"{r.comment}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase">{r.name?.[0] || r.user?.name?.[0]}</div>
                  <span className="font-bold text-gray-800 dark:text-white text-xs uppercase tracking-wide">{r.name || r.user?.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Review Form */}
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white mb-6 text-center">Leave a Review</h3>
            {submitted ? (
              <div className="text-center py-6">
                <p className="text-4xl mb-3">✅</p>
                <p className="text-gray-800 dark:text-white text-xs uppercase tracking-wider font-bold">Thank you! Your review is pending approval.</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-5">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  required 
                  maxLength={100}
                  value={reviewForm.name}
                  onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button 
                        key={s} 
                        type="button" 
                        onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                        className={`text-xl transition-transform hover:scale-110 ${s <= reviewForm.rating ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  placeholder="Your review..." 
                  required 
                  maxLength={1000}
                  rows={4} 
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all" 
                />
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-lg transition-colors shadow-md hover:shadow-lg">
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* WhatsApp Float - Two Numbers */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <a href="https://wa.me/923320074326" target="_blank" rel="noopener noreferrer"
          className="bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-2xl">
          💬
        </a>
        <a href="https://wa.me/923323884785" target="_blank" rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-lg">
          💬
        </a>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
