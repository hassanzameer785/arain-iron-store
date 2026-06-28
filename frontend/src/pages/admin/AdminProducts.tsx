import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminDashboard';
import api from '../../utils/api';

const AdminProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', unit: 'piece', qualityLevel: 'Standard', stock: '', brand: '', isFeatured: false });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const [p, c] = await Promise.all([api.get('/products?limit=100'), api.get('/categories')]);
      setProducts(p.data.data);
      setCategories(c.data.data);
    } catch (e) {} finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, form);
      } else {
        await api.post('/products', form);
      }
      setShowForm(false); setEditProduct(null);
      setForm({ name: '', description: '', category: '', price: '', unit: 'piece', qualityLevel: 'Standard', stock: '', brand: '', isFeatured: false });
      fetchProducts();
    } catch (err: any) { alert(err.response?.data?.message || 'Error'); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const startEdit = (p: any) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description || '', category: p.category?._id || '', price: p.price, unit: p.unit, qualityLevel: p.qualityLevel, stock: p.stock, brand: p.brand || '', isFeatured: p.isFeatured });
    setShowForm(true);
  };

  return (
    <AdminLayout title="Products">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">{products.length} products total</p>
        <button onClick={() => { setShowForm(true); setEditProduct(null); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">+ Add Product</button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-gray-800 text-lg">{editProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => { setShowForm(false); setEditProduct(null); }} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Product Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} maxLength={150}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Category *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select...</option>
                    {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Quality Level</label>
                  <select value={form.qualityLevel} onChange={e => setForm(f => ({ ...f, qualityLevel: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['Standard', 'Premium', 'Economy'].map(q => <option key={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Price (Rs.) *</label>
                  <input type="number" required value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} max={100000000}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Unit</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {['piece', 'kg', 'ton', 'bag', 'feet', 'meter', 'dozen', 'bundle'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Stock Qty</label>
                  <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} max={1000000}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Brand</label>
                  <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} maxLength={100}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} maxLength={2000}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="rounded" />
                  <label htmlFor="featured" className="text-sm text-gray-700">Featured on Homepage</label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Quality', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>)
              ) : products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover rounded-lg" /> : '📦'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                        {p.isFeatured && <span className="text-xs text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded">Featured</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.category?.name}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">Rs. {p.price.toLocaleString()}<span className="text-gray-400 font-normal">/{p.unit}</span></td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.stock <= 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>{p.stock}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.qualityLevel}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-600 text-sm font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
