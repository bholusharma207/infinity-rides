import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.addresses?.length > 0) {
      setSavedAddresses(user.addresses);
      const def = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setAddress(def);
    }
  }, [user]);

  const items = cart.items || [];
  const subtotal = items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleCheckout = async () => {
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill all address fields');
      return;
    }
    setLoading(true);
    try {
      // 1. Place order
      const { data: orderData } = await api.post('/orders', { shippingAddress: address });
      const orderId = orderData.order._id;

      // 2. Create payment
      const { data: payData } = await api.post('/payment/create', { orderId });

      if (payData.demoMode) {
        toast.success('Order placed successfully! (Demo Mode)');
        await fetchCart();
        navigate(`/orders`);
        return;
      }

      // 3. Get Razorpay key
      const { data: keyData } = await api.get('/payment/key');

      // 4. Open Razorpay checkout
      const options = {
        key: keyData.key,
        amount: payData.razorpayOrder.amount,
        currency: 'INR',
        name: 'Infinity Rides',
        description: `Order ${orderData.order.orderNumber}`,
        order_id: payData.razorpayOrder.id,
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });
            toast.success('Payment successful!');
            await fetchCart();
            navigate('/orders');
          } catch (err) {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: user.name, email: user.email, contact: address.phone },
        theme: { color: '#FF6B00' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-2xl font-heading font-bold text-white mb-6">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Address Form */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <h3 className="text-white font-semibold mb-4">Shipping Address</h3>
            {savedAddresses.length > 0 && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Saved Addresses:</p>
                <div className="flex flex-wrap gap-2">
                  {savedAddresses.map((addr, i) => (
                    <button key={i} onClick={() => setAddress(addr)}
                      className={`text-left text-xs p-3 rounded-xl border transition-all ${address.pincode === addr.pincode && address.street === addr.street ? 'border-primary bg-primary/10 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>
                      <span className="font-medium">{addr.fullName}</span><br />{addr.street}, {addr.city}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-gray-400 text-sm mb-1 block">Full Name</label><input name="fullName" value={address.fullName} onChange={handleChange} className="input-field" /></div>
              <div><label className="text-gray-400 text-sm mb-1 block">Phone</label><input name="phone" value={address.phone} onChange={handleChange} className="input-field" /></div>
              <div className="sm:col-span-2"><label className="text-gray-400 text-sm mb-1 block">Street Address</label><input name="street" value={address.street} onChange={handleChange} className="input-field" /></div>
              <div><label className="text-gray-400 text-sm mb-1 block">City</label><input name="city" value={address.city} onChange={handleChange} className="input-field" /></div>
              <div><label className="text-gray-400 text-sm mb-1 block">State</label><input name="state" value={address.state} onChange={handleChange} className="input-field" /></div>
              <div><label className="text-gray-400 text-sm mb-1 block">Pincode</label><input name="pincode" value={address.pincode} onChange={handleChange} className="input-field" /></div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="glass-card p-6 h-fit sticky top-24">
          <h3 className="text-white font-heading font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-400 truncate mr-2">{item.product?.name} ×{item.quantity}</span>
                <span className="text-white shrink-0">{formatPrice(item.priceAtAdd * item.quantity)}</span>
              </div>
            ))}
          </div>
          <hr className="border-white/10 my-3" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span className="text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">GST (18%)</span><span className="text-white">{formatPrice(tax)}</span></div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-lg font-bold"><span className="text-white">Total</span><span className="text-primary">{formatPrice(total)}</span></div>
          </div>
          <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
