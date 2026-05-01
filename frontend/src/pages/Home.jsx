import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiArrowRight, HiShieldCheck, HiTruck, HiCurrencyRupee } from 'react-icons/hi';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/ui/Spinner';

const categories = [
  { name: 'Helmet', icon: '🪖', desc: 'Full face, half face & more' },
  { name: 'Jacket', icon: '🧥', desc: 'Touring & urban riding' },
  { name: 'Gloves', icon: '🧤', desc: 'All-season protection' },
  { name: 'Boots', icon: '🥾', desc: 'Ankle protection & grip' },
  { name: 'Guards', icon: '🛡️', desc: 'Knee & elbow guards' },
  { name: 'Accessories', icon: '🔧', desc: 'Locks, balaclavas & more' },
];

const features = [
  { icon: HiShieldCheck, title: 'Certified Safety', desc: 'ISI & CE certified gear' },
  { icon: HiTruck, title: 'Free Shipping', desc: 'On orders above ₹999' },
  { icon: HiCurrencyRupee, title: 'Best Prices', desc: 'Guaranteed lowest prices' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products?sort=rating&limit=8');
        setFeatured(data.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block badge-primary mb-4 text-sm">🏍️ Premium Riding Gear</span>
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight mb-6">
              Ride with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light">Confidence.</span>
              <br />Gear Built to Last.
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Premium motorcycle riding accessories for the fearless Indian rider. From ISI-certified helmets to CE-rated armor — we've got you covered.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="btn-primary text-base flex items-center gap-2">
                Shop Now <HiArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products?category=Helmet" className="btn-secondary text-base">
                Browse Helmets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-y border-white/5 bg-dark-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page-container">
        <h2 className="section-title mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.name}`}
              className="glass-card p-5 text-center group"
            >
              <span className="text-3xl block mb-2">{cat.icon}</span>
              <h3 className="text-white font-semibold text-sm mb-1">
                {['Boots', 'Accessories', 'Guards', 'Gloves'].includes(cat.name) ? cat.name : cat.name + 's'}
              </h3>
              <p className="text-gray-500 text-xs">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Top Rated Gear</h2>
          <Link to="/products" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
            View All <HiArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <Spinner />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="page-container">
        <div className="glass-card overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
          <div className="relative z-10 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">Ready to Gear Up?</h2>
            <p className="text-gray-400 mb-6 max-w-lg">Join thousands of riders who trust Infinity Rides for their safety gear. Free shipping on orders above ₹999.</p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              Explore Collection <HiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
