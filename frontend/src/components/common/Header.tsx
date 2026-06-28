import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { user, logout, isAdmin, isEmployee } = useAuth();
  const { count } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/images/logo.png" 
              alt="Arain Iron Store" 
              className="w-9 h-9 object-cover rounded border border-gray-200 dark:border-gray-700" 
            />
            <div>
              <p className="font-extrabold text-sm tracking-widest leading-none text-gray-900 dark:text-white">ARAIN</p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 tracking-[0.2em] font-medium mt-1 uppercase">Iron Store</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link 
                  key={link.to} 
                  to={link.to}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${isActive ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 pb-1' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  {link.label}
                </Link>
              );
            })}
            {(isAdmin || isEmployee) && (
              <Link 
                to="/admin" 
                className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2.5 py-1 rounded transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-300"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>

            {/* User */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block font-medium text-gray-700 dark:text-gray-300">{user.name.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl py-1 z-50">
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 transition-colors" 
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-gray-200 dark:border-gray-800 space-y-1">
            {navLinks.map(link => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" 
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {(isAdmin || isEmployee) && (
              <Link 
                to="/admin" 
                className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400" 
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
