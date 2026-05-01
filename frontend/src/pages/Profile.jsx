import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [addrForm, setAddrForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddrForm, setShowAddrForm] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/me', { name, email });
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      toast.success('Password changed');
      setCurrentPassword(''); setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setPwLoading(false);
    }
  };

  const addAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/address', addrForm);
      setAddresses(data.addresses);
      updateUser({ ...user, addresses: data.addresses });
      setAddrForm({ fullName: '', phone: '', street: '', city: '', state: '', pincode: '' });
      setShowAddrForm(false);
      toast.success('Address added');
    } catch (err) {
      toast.error('Failed to add address');
    }
  };

  const deleteAddress = async (id) => {
    try {
      const { data } = await api.delete(`/auth/address/${id}`);
      setAddresses(data.addresses);
      updateUser({ ...user, addresses: data.addresses });
      toast.success('Address deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="page-container animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-2xl font-heading font-bold text-white mb-6">My Profile</h1>

      {/* Profile Info */}
      <form onSubmit={handleUpdate} className="glass-card p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-gray-400 text-sm mb-1 block">Name</label><input value={name} onChange={(e) => setName(e.target.value)} className="input-field" /></div>
          <div><label className="text-gray-400 text-sm mb-1 block">Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" /></div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary mt-4">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Password */}
      <form onSubmit={handlePassword} className="glass-card p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Change Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="text-gray-400 text-sm mb-1 block">Current Password</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" required /></div>
          <div><label className="text-gray-400 text-sm mb-1 block">New Password</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" required /></div>
        </div>
        <button type="submit" disabled={pwLoading} className="btn-secondary mt-4">
          {pwLoading ? 'Updating...' : 'Change Password'}
        </button>
      </form>

      {/* Addresses */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Saved Addresses</h3>
          <button onClick={() => setShowAddrForm(!showAddrForm)} className="text-primary text-sm hover:underline">
            {showAddrForm ? 'Cancel' : '+ Add Address'}
          </button>
        </div>
        {showAddrForm && (
          <form onSubmit={addAddress} className="bg-dark-400/50 rounded-xl p-4 mb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input name="fullName" placeholder="Full Name" value={addrForm.fullName} onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })} className="input-field !py-2 text-sm" required />
              <input name="phone" placeholder="Phone" value={addrForm.phone} onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} className="input-field !py-2 text-sm" required />
            </div>
            <input name="street" placeholder="Street" value={addrForm.street} onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })} className="input-field !py-2 text-sm" required />
            <div className="grid grid-cols-3 gap-3">
              <input name="city" placeholder="City" value={addrForm.city} onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} className="input-field !py-2 text-sm" required />
              <input name="state" placeholder="State" value={addrForm.state} onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })} className="input-field !py-2 text-sm" required />
              <input name="pincode" placeholder="Pincode" value={addrForm.pincode} onChange={(e) => setAddrForm({ ...addrForm, pincode: e.target.value })} className="input-field !py-2 text-sm" required />
            </div>
            <button type="submit" className="btn-primary !py-2 text-sm">Save Address</button>
          </form>
        )}
        {addresses.length === 0 ? (
          <p className="text-gray-500 text-sm">No saved addresses</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div key={addr._id} className="flex items-start justify-between bg-dark-400/30 rounded-xl p-4">
                <div>
                  <p className="text-white text-sm font-medium">{addr.fullName}</p>
                  <p className="text-gray-400 text-xs mt-1">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-gray-500 text-xs mt-0.5">📞 {addr.phone}</p>
                </div>
                <button onClick={() => deleteAddress(addr._id)} className="text-red-400 hover:text-red-300 text-xs">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
