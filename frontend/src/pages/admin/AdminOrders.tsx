import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminDashboard';
import api from '../../utils/api';

// ─── ADMIN ORDERS ─────────────────────────────────────────────────────────────
export const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [printOrder, setPrintOrder] = useState<any>(null);

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
  };

  const updatePayment = async (id: string, paymentStatus: string) => {
    await api.put(`/orders/${id}/status`, { paymentStatus });
    setOrders(prev => prev.map(o => o._id === id ? { ...o, paymentStatus } : o));
  };

  const handleDoneAndPrint = async (o: any) => {
    if (o.status !== 'delivered') {
      await updateStatus(o._id, 'delivered');
    }
    setPrintOrder(o);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <>
      <div className="no-print">
        <AdminLayout title="Orders">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? <tr><td colSpan={7} className="text-center py-10 text-gray-400">Loading...</td></tr> :
                orders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm font-medium text-gray-800">{o.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-800">{o.customer?.name}</p>
                      <p className="text-xs text-gray-400">{o.customer?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{o.items?.length} items</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-800">Rs. {o.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select value={o.paymentStatus} onChange={e => updatePayment(o._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500">
                        {['unpaid', 'paid', 'refunded'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDoneAndPrint(o)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold shadow transition-colors">
                        Done & Print
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
      </div>

      {/* Printable Invoice */}
      {printOrder && (
        <div className="hidden print-only bg-white text-black p-8 font-sans w-full max-w-4xl mx-auto">
          <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
            <div className="flex items-center gap-4">
              <img src="/images/logo.png" alt="Logo" className="w-16 h-16 object-cover border border-gray-800" />
              <div>
                <h1 className="text-3xl font-black uppercase tracking-wider">Arain Iron Store</h1>
                <p className="text-sm font-semibold text-gray-600">Vehova, Pakistan</p>
                <p className="text-xs text-gray-500">Phone: 0334 7135272 | 0333 2530723</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold uppercase text-gray-800 mb-1">INVOICE</h2>
              <p className="font-mono font-semibold text-gray-700">{printOrder.orderNumber}</p>
              <p className="text-sm mt-1">Date: {new Date(printOrder.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="flex justify-between mb-8">
            <div className="w-1/2">
              <h3 className="text-sm font-bold uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">Billed To</h3>
              <p className="font-bold text-lg">{printOrder.customer?.name}</p>
              <p className="text-sm text-gray-700">{printOrder.customer?.email}</p>
              <p className="text-sm text-gray-700 mt-1">{printOrder.shippingAddress?.street}, {printOrder.shippingAddress?.city}</p>
              <p className="text-sm text-gray-700">{printOrder.shippingAddress?.state} - {printOrder.shippingAddress?.phone}</p>
            </div>
            <div className="w-1/3 text-right">
              <h3 className="text-sm font-bold uppercase text-gray-500 border-b border-gray-300 pb-1 mb-2">Payment Details</h3>
              <p className="text-sm">Method: <span className="font-bold uppercase">{printOrder.paymentMethod || 'Online'}</span></p>
              <p className="text-sm">Status: <span className={`font-bold uppercase ${printOrder.paymentStatus === 'paid' ? 'text-green-700' : 'text-red-600'}`}>{printOrder.paymentStatus}</span></p>
            </div>
          </div>

          <table className="w-full mb-8 border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-800">
                <th className="text-left py-3 px-2 font-bold uppercase text-sm">Item</th>
                <th className="text-center py-3 px-2 font-bold uppercase text-sm">Qty</th>
                <th className="text-right py-3 px-2 font-bold uppercase text-sm">Price</th>
                <th className="text-right py-3 px-2 font-bold uppercase text-sm">Total</th>
              </tr>
            </thead>
            <tbody>
              {printOrder.items?.map((item: any, i: number) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-3 px-2 font-medium">{item.name}</td>
                  <td className="py-3 px-2 text-center">{item.quantity}</td>
                  <td className="py-3 px-2 text-right">Rs. {item.price?.toLocaleString()}</td>
                  <td className="py-3 px-2 text-right font-bold">Rs. {(item.quantity * item.price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-1/3 border-t-2 border-black pt-2">
              <div className="flex justify-between font-black text-xl">
                <span>Grand Total:</span>
                <span>Rs. {printOrder.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center text-sm text-gray-500 italic border-t border-gray-200 pt-4">
            Thank you for your business. Quality construction materials trusted since 1998.
          </div>
        </div>
      )}
    </>
  );
};

// ─── ADMIN CUSTOMERS ──────────────────────────────────────────────────────────
export const AdminCustomers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(r => setUsers(r.data.data.filter((u: any) => u.role === 'customer'))).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const toggleActive = async (id: string, isActive: boolean) => {
    await api.put(`/users/${id}`, { isActive: !isActive });
    setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !isActive } : u));
  };

  return (
    <AdminLayout title="Customers">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Email', 'Phone', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? <tr><td colSpan={6} className="text-center py-10 text-gray-400">Loading...</td></tr> :
                users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">{u.name?.[0]}</div>
                        <span className="text-sm font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(u._id, u.isActive)} className={`text-xs font-medium ${u.isActive ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`}>
                        {u.isActive ? 'Disable' : 'Enable'}
                      </button>
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

// ─── ADMIN EMPLOYEES ──────────────────────────────────────────────────────────
export const AdminEmployees = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', permissions: [] as string[] });

  const allPermissions = ['manage_products', 'manage_orders', 'manage_customers', 'view_reports'];

  const fetchEmployees = async () => {
    const { data } = await api.get('/users');
    setEmployees(data.data.filter((u: any) => u.role === 'employee'));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/employee', form);
      setShowForm(false);
      setForm({ name: '', email: '', password: '', phone: '', permissions: [] });
      fetchEmployees();
    } catch (err: any) { alert(err.response?.data?.message || 'Error'); }
  };

  const togglePerm = (perm: string) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(perm) ? f.permissions.filter(p => p !== perm) : [...f.permissions, perm]
    }));
  };

  const removeEmployee = async (id: string) => {
    if (!window.confirm('Remove this employee?')) return;
    await api.delete(`/users/${id}`);
    fetchEmployees();
  };

  return (
    <AdminLayout title="Employees">
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-500 text-sm">{employees.length} employees</p>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium">+ Add Employee</button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-gray-800">Add Employee</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', type: 'text', maxLength: 100 },
                { key: 'email', label: 'Email', type: 'email', maxLength: 150 },
                { key: 'phone', label: 'Phone', type: 'tel', maxLength: 20 },
                { key: 'password', label: 'Password', type: 'password', maxLength: 128 },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">{f.label}</label>
                  <input type={f.type} required value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} maxLength={f.maxLength}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase">Permissions</label>
                <div className="space-y-2">
                  {allPermissions.map(perm => (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.permissions.includes(perm)} onChange={() => togglePerm(perm)} className="rounded" />
                      <span className="text-sm text-gray-700 capitalize">{perm.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm">Add Employee</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 border border-gray-200 rounded-lg text-sm text-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map(emp => (
          <div key={emp._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg">{emp.name?.[0]}</div>
              <div>
                <p className="font-bold text-gray-800">{emp.name}</p>
                <p className="text-xs text-gray-400">{emp.email}</p>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              {(emp.permissions || []).map((p: string) => (
                <span key={p} className="inline-block mr-1 mb-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full capitalize">{p.replace('_', ' ')}</span>
              ))}
              {(!emp.permissions || emp.permissions.length === 0) && <p className="text-xs text-gray-400">No specific permissions</p>}
            </div>
            <button onClick={() => removeEmployee(emp._id)} className="text-red-500 hover:text-red-600 text-xs font-medium">Remove Employee</button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
