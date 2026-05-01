import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
                <span className="text-white font-heading font-black text-xl">∞</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Infinity <span className="text-primary">Rides</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Premium motorcycle riding gear built for Indian riders. Safety meets style with our curated collection of helmets, jackets, gloves, and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {['Shop All', 'Helmets', 'Jackets', 'Gloves'].map((item) => (
                <li key={item}>
                  <Link to={`/products${item === 'Shop All' ? '' : `?category=${item.slice(0, -1)}`}`} className="text-gray-500 hover:text-primary text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
            <ul className="space-y-2">
              {[{ label: 'My Profile', path: '/profile' }, { label: 'My Orders', path: '/orders' }, { label: 'Cart', path: '/cart' }, { label: 'Login', path: '/login' }].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-gray-500 hover:text-primary text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Infinity Rides. All rights reserved.</p>
          <p className="text-gray-600 text-xs">Built with ❤️ for Indian riders</p>
        </div>
      </div>
    </footer>
  );
}
