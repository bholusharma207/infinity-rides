import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiAdjustments, HiX } from 'react-icons/hi';
import api from '../utils/api';
import ProductCard from '../components/product/ProductCard';
import Spinner from '../components/ui/Spinner';

const categories = ['Helmet', 'Gloves', 'Jacket', 'Boots', 'Guards', 'Accessories'];
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'name_asc', label: 'Name: A → Z' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    fetchProducts();
  }, [keyword, category, sort, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, sort });
      if (keyword) params.set('keyword', keyword);
      if (category) params.set('category', category);

      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">
            {keyword ? `Results for "${keyword}"` : category ? `${category}s` : 'All Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{total} products found</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden btn-secondary !py-2 !px-3 flex items-center gap-2 text-sm"
        >
          <HiAdjustments className="w-4 h-4" /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-dark-800 p-6 overflow-y-auto' : 'hidden'} md:block md:relative md:inset-auto md:z-auto md:bg-transparent md:p-0 w-full md:w-56 shrink-0`}>
          <div className="flex items-center justify-between md:hidden mb-4">
            <h3 className="text-white font-bold">Filters</h3>
            <button onClick={() => setShowFilters(false)}><HiX className="w-6 h-6 text-gray-400" /></button>
          </div>

          {/* Category Filter */}
          <div className="glass-card p-4 mb-4">
            <h4 className="text-white font-semibold text-sm mb-3">Category</h4>
            <div className="space-y-2">
              <button onClick={() => updateFilter('category', '')}
                className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!category ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                All Categories
              </button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => updateFilter('category', cat)}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${category === cat ? 'bg-primary/20 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  {['Boots', 'Accessories', 'Guards', 'Gloves'].includes(cat) ? cat : `${cat}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="glass-card p-4 mb-4">
            <h4 className="text-white font-semibold text-sm mb-3">Sort By</h4>
            <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)}
              className="input-field !py-2 text-sm">
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {(keyword || category) && (
            <button onClick={clearFilters} className="btn-danger !py-2 w-full text-sm flex items-center justify-center gap-2">
              <HiX className="w-4 h-4" /> Clear Filters
            </button>
          )}
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <Spinner />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-2">No products found</p>
              <button onClick={clearFilters} className="text-primary hover:underline text-sm">Clear all filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-30">Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-primary text-white' : 'bg-dark-200 text-gray-400 hover:text-white'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="btn-secondary !py-2 !px-4 text-sm disabled:opacity-30">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
