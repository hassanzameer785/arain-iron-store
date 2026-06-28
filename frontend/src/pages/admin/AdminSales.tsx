import React, { useState, useEffect } from 'react';
import { AdminLayout } from './AdminDashboard';
import api from '../../utils/api';

const AdminSales = () => {
  const [sales, setSales] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get('/dashboard/sales').then(r => setSales(r.data.data)).catch(() => {});
    api.get('/orders?limit=50').then(r => setOrders(r.data.data)).catch(() => {});
  }, []);

  const cards = sales ? [
    { label: "Today's Revenue", value: `Rs. ${sales.daily.revenue.toLocaleString()}`, sub: `${sales.daily.orders} orders`, icon: '📅', color: 'from-blue-500 to-blue-600' },
    { label: 'Monthly Revenue', value: `Rs. ${sales.monthly.revenue.toLocaleString()}`, sub: `${sales.monthly.orders} orders`, icon: '📆', color: 'from-blue-500 to-blue-600' },
    { label: 'All-Time Revenue', value: `Rs. ${sales.allTime.revenue.toLocaleString()}`, sub: `${sales.allTime.orders} total orders`, icon: '💰', color: 'from-green-500 to-green-600' },
  ] : [];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
  };

  return (
    <AdminLayout title="Sales">
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-xl p-5 text-white shadow-md`}>
            <div className="text-3xl mb-3">{c.icon}</div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-sm mt-1 opacity-80">{c.label}</p>
            <p className="text-xs mt-0.5 opacity-60">{c.sub}</p>
          </div>
        ))}
        {!sales && Array(3).fill(0).map((_, i) => <div key={i} className="bg-gray-100 rounded-xl h-32 animate-pulse" />)}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order #', 'Customer', 'Date', 'Amount', 'Status', 'Payment'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((o: any) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm font-medium text-gray-700">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{o.customer?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-800">Rs. {o.totalAmount?.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium ${o.paymentStatus === 'paid' ? 'text-green-600' : 'text-blue-500'}`}>{o.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSales;
