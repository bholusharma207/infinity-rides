import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineUser, HiOutlineSearch, HiOutlineMenu, HiOutlineX, HiOutlineLogout, HiOutlineCog } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <span className="text-white font-heading font-black text-lg">∞</span>
            </div>
            <span className="font-heading font-bold text-lg text-white hidden sm:block">
              Infinity <span className="text-primary">Rides</span>
            </span>
          </Link>

          {/* Search - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg">
            <div className="relative w-full">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search helmets, gloves, jackets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-400/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </form>

          {/* Nav Actions */}
          <nav className="flex items-center gap-2">
            <Link to="/products" className="hidden sm:block text-sm text-gray-400 hover:text-white transition-colors px-3 py-2">
              Shop
            </Link>

            <Link to="/cart" className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <HiOutlineShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold animate-fade-in">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/30 to-primary-dark/30 rounded-full flex items-center justify-center border border-primary/30">
                    <span className="text-primary text-sm font-bold">{user.name?.[0]?.toUpperCase()}</span>
                  </div>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 glass-card rounded-xl shadow-glass p-2 animate-fade-in z-50">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      <HiOutlineUser className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/orders" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      <HiOutlineShoppingCart className="w-4 h-4" /> My Orders
                    </Link>
                    {isAdmin() && (
                      <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <HiOutlineCog className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <hr className="border-white/5 my-1" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 rounded-lg transition-colors w-full text-left">
                      <HiOutlineLogout className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary !py-2 !px-4 text-sm">
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
              {mobileOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </nav>
        </div>

        {/* Mobile Search */}
        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-dark-400/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50"
                />
              </div>
            </form>
            <div className="flex flex-col gap-1 mt-3">
              <Link to="/products" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">Shop All</Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg">Cart ({cartCount})</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
