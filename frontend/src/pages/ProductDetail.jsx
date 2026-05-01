import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiStar, HiOutlineShoppingCart, HiMinus, HiPlus, HiArrowLeft } from 'react-icons/hi';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/helpers';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      await addToCart(product._id, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add');
    }
  };

  if (loading) return <Spinner size="lg" />;
  if (!product) return <div className="page-container text-center text-gray-500 py-20">Product not found</div>;

  const finalPrice = product.discount > 0 ? Math.round(product.price * (1 - product.discount / 100)) : product.price;

  return (
    <div className="page-container animate-fade-in">
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary text-sm mb-6 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div>
          <div className="glass-card overflow-hidden aspect-square mb-4">
            <img src={getImageUrl(product.images?.[selectedImage])} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${i === selectedImage ? 'border-primary' : 'border-white/10 hover:border-white/30'}`}>
                  <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="badge-primary mb-3">{product.category}</span>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">{product.name}</h1>
          <p className="text-gray-500 text-sm mb-4">By {product.brand}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <HiStar key={s} className={`w-5 h-5 ${s <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
              ))}
            </div>
            <span className="text-gray-400 text-sm">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-white">{formatPrice(finalPrice)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-gray-500 line-through text-lg">{formatPrice(product.price)}</span>
                <span className="badge bg-green-500/20 text-green-400">{product.discount}% OFF</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>

          {/* Sizes & Colors */}
          {product.sizes?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-white text-sm font-semibold mb-2">Available Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span key={size} className="px-3 py-1.5 bg-dark-300 border border-white/10 rounded-lg text-sm text-gray-300">{size}</span>
                ))}
              </div>
            </div>
          )}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white text-sm font-semibold mb-2">Available Colors</h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span key={color} className="px-3 py-1.5 bg-dark-300 border border-white/10 rounded-lg text-sm text-gray-300">{color}</span>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="badge-success">✓ In Stock ({product.stock} left)</span>
            ) : (
              <span className="badge-danger">✗ Out of Stock</span>
            )}
          </div>

          {/* Quantity + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-dark-300 rounded-xl border border-white/10">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3 text-gray-400 hover:text-white transition-colors">
                  <HiMinus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-white font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="p-3 text-gray-400 hover:text-white transition-colors">
                  <HiPlus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <HiOutlineShoppingCart className="w-5 h-5" /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
