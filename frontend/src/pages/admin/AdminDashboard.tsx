import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/products', label: 'Products', icon: '📦' },
    { to: '/admin/orders', label: 'Orders', icon: '🛒' },
    { to: '/admin/customers', label: 'Customers', icon: '👥' },
    { to: '/admin/employees', label: 'Employees', icon: '👤' },
    { to: '/admin/sales', label: 'Sales', icon: '📊' },
    { to: '/', label: 'View Store', icon: '🏪' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} bg-gray-900 text-white flex-shrink-0 transition-all duration-200 flex flex-col`}>
        <div className="p-4 border-b border-gray-700 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0">A</div>
          {sidebarOpen && <div className="min-w-0"><p className="font-bold text-xs truncate">Arain Iron Store</p><p className="text-xs text-gray-400">Admin</p></div>}
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(item => (
            <Link key={item.to} to={item.to}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm">
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          {sidebarOpen && <p className="text-xs text-gray-400 mb-2 truncate">{user?.name}</p>}
          <button onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm">
            🚪 {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">☰</button>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">{user?.name?.[0]}</div>
            <span className="text-sm text-gray-700 hidden sm:block">{user?.name}</span>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data.data)).catch(() => {});
  }, []);

  const statCards = stats ? [
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'bg-blue-50 border-blue-200' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '🛒', color: 'bg-blue-50 border-blue-200' },
    { label: 'Total Customers', value: stats.totalUsers, icon: '👥', color: 'bg-green-50 border-green-200' },
    { label: 'Total Revenue', value: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`, icon: '💰', color: 'bg-purple-50 border-purple-200' },
  ] : [];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className={`bg-white rounded-xl p-5 border ${s.color} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
        {!stats && Array(4).fill(0).map((_, i) => <div key={i} className="bg-white rounded-xl p-5 h-28 animate-pulse border border-gray-100" />)}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">⚠️ Low Stock Alerts</h3>
          {stats?.lowStock?.length === 0 ? (
            <p className="text-green-600 text-sm">All products are well stocked ✅</p>
          ) : (
            <div className="space-y-2">
              {(stats?.lowStock || []).map((p: any) => (
                <div key={p._id} className="flex justify-between text-sm bg-red-50 px-3 py-2 rounded-lg">
                  <span className="text-gray-700">{p.name}</span>
                  <span className="text-red-600 font-bold">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">🕐 Recent Orders</h3>
          <div className="space-y-2">
            {(stats?.recentOrders || []).map((o: any) => (
              <div key={o._id} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                <div>
                  <p className="font-medium text-gray-800">#{o.orderNumber}</p>
                  <p className="text-xs text-gray-400">{o.customer?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-700">Rs. {o.totalAmount?.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export { AdminLayout };
export default AdminDashboard;
