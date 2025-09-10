import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe, logout } from '../store/slices/authSlice';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/battles', label: 'Battles', icon: '⚔️' },
    { path: '/blogs', label: 'Blogs', icon: '📂' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="glass-effect sticky top-0 z-50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-lg">⚔️</span>
                </div>
                <span className="text-xl font-bold gradient-text">BlogBattle</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    isActive(item.path) 
                      ? 'bg-primary-900 text-primary-200 shadow-sm border border-primary-700' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <>
                  <span className="text-gray-300">Hi, {user.username}</span>
                  {(user.roles || []).includes('admin') && (
                    <button className="btn-secondary text-sm" onClick={() => navigate('/admin/tournaments/create')}>New Tournament</button>
                  )}
                  <button className="btn-secondary text-sm" onClick={() => navigate('/submit')}>New Post</button>
                  <button className="btn-primary text-sm" onClick={() => dispatch(logout())}>Logout</button>
                </>
              ) : (
                <>
                  <button className="btn-secondary text-sm" onClick={() => navigate('/login')}>
                    Login
                  </button>
                  <button className="btn-primary text-sm" onClick={() => navigate('/register')}>
                    Register
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-3 ${
                      isActive(item.path) 
                        ? 'bg-primary-900 text-primary-200 border border-primary-700' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
                <div className="pt-4 space-y-2">
                  {user ? (
                    <>
                      <button className="w-full btn-secondary text-sm" onClick={() => { setIsMobileMenuOpen(false); navigate('/submit'); }}>New Post</button>
                      <button className="w-full btn-primary text-sm" onClick={() => { setIsMobileMenuOpen(false); dispatch(logout()); }}>Logout</button>
                    </>
                  ) : (
                    <>
                      <button className="w-full btn-secondary text-sm" onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}>Login</button>
                      <button className="w-full btn-primary text-sm" onClick={() => { setIsMobileMenuOpen(false); navigate('/register'); }}>Register</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
