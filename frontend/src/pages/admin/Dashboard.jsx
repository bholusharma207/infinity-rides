import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatPrice, getStatusColor } from '../../utils/helpers';
import Spinner from '../../components/ui/Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        setStats(data.stats);
        setRecent(data.recentOrders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Spinner />;

  const cards = [
    { label: 'Total Revenue', value: formatPrice(stats?.revenue || 0), color: 'from-green-500/20 to-green-600/5', text: 'text-green-400' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, color: 'from-primary/20 to-primary/5', text: 'text-primary' },
    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'from-blue-500/20 to-blue-600/5', text: 'text-blue-400' },
    { label: 'Total Products', value: stats?.totalProducts || 0, color: 'from-purple-500/20 to-purple-600/5', text: 'text-purple-400' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-heading font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className={`glass-card p-5 bg-gradient-to-br ${card.color}`}>
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className={`text-2xl font-bold mt-1 ${card.text}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <h2 className="text-lg font-heading font-semibold text-white mb-4">Recent Orders</h2>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-500 font-medium">Order</th>
                <th className="text-left p-4 text-gray-500 font-medium">Customer</th>
                <th className="text-left p-4 text-gray-500 font-medium">Total</th>
                <th className="text-left p-4 text-gray-500 font-medium">Status</th>
                <th className="text-left p-4 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order) => (
                <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-white font-medium">{order.orderNumber}</td>
                  <td className="p-4 text-gray-400">{order.user?.name || 'N/A'}</td>
                  <td className="p-4 text-white">{formatPrice(order.totalPrice)}</td>
                  <td className="p-4"><span className={getStatusColor(order.status)}>{order.status}</span></td>
                  <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
