import { Link } from 'react-router-dom';
import { HiMinus, HiPlus, HiTrash, HiArrowRight } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function Cart() {
  const { user } = useAuth();
  const { cart, loading, updateQuantity, removeItem } = useCart();

  if (!user) return (
    <div className="page-container text-center py-20">
      <p className="text-gray-400 mb-4">Please login to view your cart</p>
      <Link to="/login" className="btn-primary">Login</Link>
    </div>
  );

  if (loading) return <Spinner />;

  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.priceAtAdd * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  const handleQty = async (productId, newQty) => {
    try { await updateQuantity(productId, newQty); }
    catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  const handleRemove = async (productId, name) => {
    try { await removeItem(productId); toast.success(`${name} removed`); }
    catch (e) { toast.error('Failed to remove'); }
  };

  if (items.length === 0) return (
    <div className="page-container text-center py-20 animate-fade-in">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-2xl font-heading font-bold text-white mb-2">Your cart is empty</h2>
      <p className="text-gray-500 mb-6">Add some riding gear to get started!</p>
      <Link to="/products" className="btn-primary inline-flex items-center gap-2">Shop Now <HiArrowRight className="w-5 h-5" /></Link>
    </div>
  );

  return (
    <div className="page-container animate-fade-in">
      <h1 className="text-2xl font-heading font-bold text-white mb-6">Shopping Cart ({items.length} items)</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="glass-card p-4 flex gap-4">
              <Link to={`/product/${item.product?._id}`} className="w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-dark-400">
                <img src={getImageUrl(item.product?.images?.[0])} alt={item.product?.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product?._id}`} className="text-white font-medium text-sm hover:text-primary transition-colors line-clamp-2">
                  {item.product?.name}
                </Link>
                {(item.size || item.color) && (
                  <div className="flex gap-2 mt-1">
                    {item.size && <span className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-400">Size: {item.size}</span>}
                    {item.color && <span className="text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-400">Color: {item.color}</span>}
                  </div>
                )}
                <p className="text-primary font-bold mt-1">{formatPrice(item.priceAtAdd)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-dark-400 rounded-lg border border-white/10">
                    <button onClick={() => handleQty(item.product?._id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30">
                      <HiMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-white text-sm">{item.quantity}</span>
                    <button onClick={() => handleQty(item.product?._id, item.quantity + 1)} className="p-1.5 text-gray-400 hover:text-white">
                      <HiPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button onClick={() => handleRemove(item.product?._id, item.product?.name)} className="text-red-400 hover:text-red-300 p-1.5 transition-colors">
                    <HiTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="glass-card p-6 h-fit sticky top-24">
          <h3 className="text-white font-heading font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Subtotal</span><span className="text-white">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Shipping</span><span className="text-white">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Tax (18% GST)</span><span className="text-white">{formatPrice(tax)}</span></div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-lg font-bold"><span className="text-white">Total</span><span className="text-primary">{formatPrice(total)}</span></div>
          </div>
          {shipping > 0 && <p className="text-xs text-gray-500 mt-3">Add {formatPrice(999 - subtotal)} more for free shipping</p>}
          <Link to="/checkout" className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
            Proceed to Checkout <HiArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
