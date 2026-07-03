import React from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiGithub, FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import styles from './Footer.module.css';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand Section */}
        <div className={styles.brandSection}>
          <Link to="/" className={styles.logo}>
            <FiActivity className={styles.logoIcon} />
            <span>Mart<span className={styles.logoAccent}>X</span></span>
          </Link>
          <p className={styles.brandDesc}>
            MartX represents the apex of modern footwear engineering. Blending performance dynamics with premium urban aesthetics, we design the shoes of tomorrow, today.
          </p>
          <div className={styles.socials}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
              <FiGithub size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
              <FiInstagram size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
              <FiTwitter size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
              <FiFacebook size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.linksColumn}>
          <h3 className={styles.colTitle}>Shop Collections</h3>
          <ul className={styles.linksList}>
            <li><Link to="/shop?category=Running" className={styles.footLink}>Running Shoes</Link></li>
            <li><Link to="/shop?category=Basketball" className={styles.footLink}>Basketball Shoes</Link></li>
            <li><Link to="/shop?category=Lifestyle" className={styles.footLink}>Lifestyle Sneakers</Link></li>
            <li><Link to="/shop?category=Training" className={styles.footLink}>Training & Gym</Link></li>
          </ul>
        </div>

        {/* Quick Links 2 */}
        <div className={styles.linksColumn}>
          <h3 className={styles.colTitle}>Company</h3>
          <ul className={styles.linksList}>
            <li><Link to="/about" className={styles.footLink}>About MartX</Link></li>
            <li><Link to="/contact" className={styles.footLink}>Contact Support</Link></li>
            <li><Link to="/wishlist" className={styles.footLink}>My Wishlist</Link></li>
            <li><Link to="/cart" className={styles.footLink}>My Shopping Cart</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.linksColumn}>
          <h3 className={styles.colTitle}>Support & Contact</h3>
          <ul className={styles.contactList}>
            <li>
              <FiMapPin className={styles.contactIcon} />
              <span>120 Sneaker Blvd, Suite 400, New York, NY 10001</span>
            </li>
            <li>
              <FiPhone className={styles.contactIcon} />
              <span>+1 (800) 555-SHOE</span>
            </li>
            <li>
              <FiMail className={styles.contactIcon} />
              <span>support@martxshoes.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContainer}>
          <p className={styles.copyright}>
            &copy; {currentYear} MartX Shoes. All rights reserved. Built with premium web technologies.
          </p>
          <div className={styles.bottomPolicies}>
            <a href="#" className={styles.footLink}>Privacy Policy</a>
            <a href="#" className={styles.footLink}>Terms of Service</a>
            <a href="#" className={styles.footLink}>Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
