import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadUsers(); }, [search]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: 50 });
      if (search) params.set('search', search);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      await api.put(`/admin/users/${id}`, { isBlocked: !isBlocked });
      toast.success(isBlocked ? 'User unblocked' : 'User blocked');
      loadUsers();
    } catch (err) { toast.error('Failed'); }
  };

  if (loading) return <Spinner />;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-white">Users</h1>
        <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="input-field !w-64 !py-2 text-sm" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-gray-500 font-medium">Name</th>
                <th className="text-left p-4 text-gray-500 font-medium">Email</th>
                <th className="text-left p-4 text-gray-500 font-medium">Role</th>
                <th className="text-left p-4 text-gray-500 font-medium">Status</th>
                <th className="text-left p-4 text-gray-500 font-medium">Joined</th>
                <th className="text-left p-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4 text-white font-medium">{u.name}</td>
                  <td className="p-4 text-gray-400">{u.email}</td>
                  <td className="p-4"><span className={u.role === 'admin' ? 'badge-primary' : 'badge bg-dark-300 text-gray-400'}>{u.role}</span></td>
                  <td className="p-4">{u.isBlocked ? <span className="badge-danger">Blocked</span> : <span className="badge-success">Active</span>}</td>
                  <td className="p-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="p-4">
                    {u.role !== 'admin' && (
                      <button onClick={() => toggleBlock(u._id, u.isBlocked)}
                        className={`text-xs px-3 py-1 rounded-lg transition-all ${u.isBlocked ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
