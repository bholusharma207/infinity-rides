import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart, HiStar } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(product._id);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const finalPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price;

  return (
    <div 
      onClick={() => navigate(`/product/${product._id}`)} 
      className="glass-card group overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-dark-400">
        <img
          src={getImageUrl(product.images?.[0])}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {product.discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{product.discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-primary/80 text-xs font-medium uppercase tracking-wider mb-1">{product.category}</span>
        <h3 className="text-white font-medium text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <HiStar key={star} className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
            ))}
          </div>
          <span className="text-gray-500 text-xs">({product.numReviews})</span>
        </div>

        {/* Price & Cart Container */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white font-bold text-lg">{formatPrice(finalPrice)}</span>
            {product.discount > 0 && (
              <span className="text-gray-500 line-through text-sm">{formatPrice(product.price)}</span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary !py-2.5 text-sm flex items-center justify-center gap-2 w-full"
          >
            <HiOutlineShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
