import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { FiSun, FiMoon, FiHeart, FiShoppingCart, FiMenu, FiX, FiActivity, FiUser, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { cartCount, wishlist, theme, toggleTheme, isLoggedIn, logout } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Close mobile menu on page transition
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Handle scroll shadow/glass density transition
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/shop', label: 'Shop' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Brand Logo */}
        <Link to="/" className={styles.logo}>
          <FiActivity className={styles.logoIcon} />
          <span>Mart<span className={styles.logoAccent}>X</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.activeLink : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className={styles.actions}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={styles.actionBtn}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>

          {/* Wishlist Link */}
          <Link to="/wishlist" className={styles.actionBtn} aria-label="Wishlist">
            <FiHeart size={20} />
            {wishlist.length > 0 && (
              <span className={styles.badge}>{wishlist.length}</span>
            )}
          </Link>

          {/* Cart Link */}
          <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </Link>

          {/* User Auth Link */}
          {isLoggedIn ? (
            <button
              onClick={logout}
              className={styles.actionBtn}
              title="Logout"
              aria-label="Logout"
            >
              <FiLogOut size={20} />
            </button>
          ) : (
            <Link
              to="/login"
              className={styles.actionBtn}
              title="Login"
              aria-label="Login"
            >
              <FiUser size={20} />
            </Link>
          )}

          {/* Mobile Toggle Burger Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={styles.mobileMenuBtn}
            aria-label="Toggle Menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={styles.mobileNav}
          >
            <div className={styles.mobileContainer}>
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `${styles.mobileNavLink} ${isActive ? styles.mobileActiveLink : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
