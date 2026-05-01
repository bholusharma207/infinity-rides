import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import api from '../../utils/api';
import { formatPrice, getImageUrl } from '../../utils/helpers';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const categories = ['Helmet', 'Gloves', 'Jacket', 'Boots', 'Guards', 'Accessories'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Helmet', brand: '', stock: '', discount: '0', sizes: '', colors: '' });
  const [files, setFiles] = useState(null);

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/admin/products?limit=100');
      setProducts(data.products);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ name: '', description: '', price: '', category: 'Helmet', brand: '', stock: '', discount: '0', sizes: '', colors: '' });
    setFiles(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditId(p._id);
    setForm({ name: p.name, description: p.description, price: String(p.price), category: p.category, brand: p.brand || '', stock: String(p.stock), discount: String(p.discount || 0), sizes: p.sizes?.join(', ') || '', colors: p.colors?.join(', ') || '' });
    setFiles(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'sizes' || k === 'colors') {
        fd.append(k, JSON.stringify(v.split(',').map(s => s.trim()).filter(Boolean)));
      } else {
        fd.append(k, v);
      }
    });
    if (files) Array.from(files).forEach(f => fd.append('images', f));

    try {
      if (editId) {
        await api.put(`/products/${editId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      loadProducts();
    } catch (err) { toast.error('Failed'); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-white">Products</h1>
        <button onClick={openAdd} className="btn-primary !py-2 flex items-center gap-2 text-sm"><HiPlus className="w-4 h-4" /> Add Product</button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-500 font-medium">Product</th>
                <th className="text-left p-4 text-gray-500 font-medium">Category</th>
                <th className="text-left p-4 text-gray-500 font-medium">Price</th>
                <th className="text-left p-4 text-gray-500 font-medium">Stock</th>
                <th className="text-left p-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={getImageUrl(p.images?.[0])} alt="" className="w-10 h-10 rounded-lg object-cover bg-dark-300" />
                      <span className="text-white font-medium line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">{p.category}</td>
                  <td className="p-4 text-white">{formatPrice(p.price)}</td>
                  <td className="p-4"><span className={p.stock > 0 ? 'text-green-400' : 'text-red-400'}>{p.stock}</span></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 text-gray-400 hover:text-primary transition-colors"><HiPencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><HiTrash className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">{editId ? 'Edit' : 'Add'} Product</h3>
              <button onClick={() => setShowModal(false)}><HiX className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field !py-2 text-sm" required />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field !py-2 text-sm h-24 resize-none" required />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field !py-2 text-sm" required />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field !py-2 text-sm">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field !py-2 text-sm" />
                <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="input-field !py-2 text-sm" required />
                <input type="number" placeholder="Discount %" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="input-field !py-2 text-sm" />
              </div>
              <input placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className="input-field !py-2 text-sm" />
              <input placeholder="Colors (comma separated)" value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className="input-field !py-2 text-sm" />
              <input type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} className="input-field !py-2 text-sm" />
              <button type="submit" className="btn-primary w-full">{editId ? 'Update' : 'Create'} Product</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
