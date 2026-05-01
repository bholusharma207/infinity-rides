import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { formatPrice, getStatusColor } from '../../utils/helpers';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { loadOrders(); }, [filter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (filter) params.set('status', filter);
      const { data } = await api.get(`/admin/orders?${params}`);
      setOrders(data.orders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      loadOrders();
    } catch (err) { toast.error('Failed'); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-white">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field !w-auto !py-2 text-sm">
          <option value="">All Status</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-500 font-medium">Order</th>
                <th className="text-left p-4 text-gray-500 font-medium">Customer</th>
                <th className="text-left p-4 text-gray-500 font-medium">Items</th>
                <th className="text-left p-4 text-gray-500 font-medium">Total</th>
                <th className="text-left p-4 text-gray-500 font-medium">Paid</th>
                <th className="text-left p-4 text-gray-500 font-medium">Status</th>
                <th className="text-left p-4 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-white font-medium">{order.orderNumber}</td>
                  <td className="p-4 text-gray-400">{order.user?.name || 'N/A'}</td>
                  <td className="p-4 text-gray-400">{order.items?.length || 0}</td>
                  <td className="p-4 text-white">{formatPrice(order.totalPrice)}</td>
                  <td className="p-4">{order.isPaid ? <span className="badge-success">Yes</span> : <span className="badge-danger">No</span>}</td>
                  <td className="p-4">
                    <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="bg-dark-400 border border-white/10 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-primary">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
