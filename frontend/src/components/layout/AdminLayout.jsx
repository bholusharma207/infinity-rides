import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineCube, HiOutlineClipboardList, HiOutlineUsers, HiOutlineArrowLeft } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const navItems = [
  { path: '/admin', icon: HiOutlineChartBar, label: 'Dashboard', end: true },
  { path: '/admin/products', icon: HiOutlineCube, label: 'Products' },
  { path: '/admin/orders', icon: HiOutlineClipboardList, label: 'Orders' },
  { path: '/admin/users', icon: HiOutlineUsers, label: 'Users' },
];

export default function AdminLayout() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin()) navigate('/login');
  }, [user]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 bg-dark-500/50 border-r border-white/5 p-4 hidden md:block shrink-0">
        <div className="mb-6">
          <h3 className="text-white font-heading font-bold text-sm">Admin Panel</h3>
          <p className="text-gray-500 text-xs mt-1">{user?.name}</p>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ path, icon: Icon, label, end }) => (
            <NavLink key={path} to={path} end={end}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive ? 'bg-primary/15 text-primary font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
              <Icon className="w-5 h-5" /> {label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/" className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-500 hover:text-white mt-8 transition-colors">
          <HiOutlineArrowLeft className="w-4 h-4" /> Back to Store
        </NavLink>
      </aside>

      {/* Mobile nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/5 px-2 py-1">
        <div className="flex justify-around">
          {navItems.map(({ path, icon: Icon, label, end }) => (
            <NavLink key={path} to={path} end={end}
              className={({ isActive }) => `flex flex-col items-center py-2 px-3 text-xs transition-all ${isActive ? 'text-primary' : 'text-gray-500'}`}>
              <Icon className="w-5 h-5 mb-0.5" /> {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
