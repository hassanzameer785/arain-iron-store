import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ProductCard from '../components/products/ProductCard';
import api from '../utils/api';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const quality = searchParams.get('quality') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      if (search) params.set('search', search);
      if (category) params.set('category', category);
      if (quality) params.set('quality', quality);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data.data);
      setTotal(data.total);
    } catch (e) {} finally { setLoading(false); }
  }, [search, category, quality, page]);

  useEffect(() => { api.get('/categories').then(r => setCategories(r.data.data)).catch(() => {}); }, []);
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setFilter = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    setSearchParams(p);
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 sticky top-24 shadow-sm">
              <h3 className="font-black text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-5 flex items-center gap-2">🔍 Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Search</label>
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={search}
                  maxLength={100}
                  onChange={e => setFilter('search', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors" 
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Category</label>
                <select 
                  value={category} 
                  onChange={e => setFilter('category', e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>

              {/* Quality */}
              <div className="mb-6">
                <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Quality Level</label>
                {['', 'Premium', 'Standard', 'Economy'].map(q => (
                  <label key={q} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="quality" 
                      value={q} 
                      checked={quality === q}
                      onChange={() => setFilter('quality', q)} 
                      className="accent-blue-600 w-3.5 h-3.5" 
                    />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{q || 'All'}</span>
                  </label>
                ))}
              </div>

              <button 
                onClick={() => { setSearchParams({}); setPage(1); }}
                className="w-full text-xs text-gray-800 dark:text-gray-200 font-bold uppercase tracking-wider py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">{loading ? 'Loading...' : `${total} products found`}</p>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 h-72 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">No products found</p>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] font-medium mt-1">Try different filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>
                {/* Pagination */}
                {total > 12 && (
                  <div className="flex justify-center gap-2 mt-8">
                    {Array(Math.ceil(total / 12)).fill(0).map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-lg text-xs font-bold transition-colors ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
