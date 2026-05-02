import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatPrice, getStatusColor, getImageUrl } from '../utils/helpers';
import Spinner from '../components/ui/Spinner';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-2xl font-heading font-bold text-white mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 mb-4">No orders yet</p>
          <Link to="/products" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-white font-semibold">{order.orderNumber}</p>
                  <p className="text-gray-500 text-xs mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <span className={getStatusColor(order.status)}>{order.status}</span>
                  <p className="text-white font-bold mt-1">{formatPrice(order.totalPrice)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-dark-400/50 rounded-lg p-2 pr-4">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-dark-300 shrink-0">
                      <img src={getImageUrl(item.image)} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-xs line-clamp-1">{item.name}</p>
                      <p className="text-gray-500 text-xs">×{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
