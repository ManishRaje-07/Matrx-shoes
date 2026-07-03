import React from 'react';
import { Link } from 'react-router-dom';
import { useShop, type Product } from '../../context/ShopContext';
import { FiHeart, FiShoppingCart, FiEye, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  const isLiked = isInWishlist(product.id);
  const discountedPrice = product.price * (1 - product.discount / 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0] || 9;
    const defaultColor = product.colors[0] || '#000000';
    addToCart(product.id, defaultSize, defaultColor, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={styles.card}
    >
      {/* Image Wrapper */}
      <div className={styles.imageWrapper}>
        <Link to={`/product/${product.id}`} className={styles.imageLink}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.productImg}
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className={styles.badges}>
          {product.newArrival && <span className={styles.badgeNew}>NEW</span>}
          {product.discount > 0 && (
            <span className={styles.badgeSale}>-{product.discount}%</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`${styles.wishlistBtn} ${isLiked ? styles.wishlistActive : ''}`}
          aria-label="Add to Wishlist"
        >
          <FiHeart size={18} fill={isLiked ? 'currentColor' : 'none'} />
        </button>

        {/* Quick Actions Hover Overlay */}
        <div className={styles.hoverOverlay}>
          <button
            onClick={handleAddToCart}
            className={styles.overlayCartBtn}
            title="Add to Cart"
            disabled={product.stock === 0}
          >
            <FiShoppingCart size={18} />
            <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
          <Link
            to={`/product/${product.id}`}
            className={styles.overlayViewBtn}
            title="Quick View"
          >
            <FiEye size={18} />
          </Link>
        </div>
      </div>

      {/* Product Details Info */}
      <div className={styles.info}>
        <div className={styles.brandRow}>
          <span className={styles.brand}>{product.brand}</span>
          <span className={styles.rating}>
            <FiStar className={styles.starIcon} />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <Link to={`/product/${product.id}`} className={styles.nameLink}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        
        <span className={styles.category}>{product.category}</span>

        <div className={styles.priceRow}>
          {product.discount > 0 ? (
            <div className={styles.priceContainer}>
              <span className={styles.priceDiscounted}>
                ${discountedPrice.toFixed(2)}
              </span>
              <span className={styles.priceOriginal}>
                ${product.price.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          )}

          {product.stock <= 3 && product.stock > 0 && (
            <span className={styles.lowStock}>Only {product.stock} left</span>
          )}
          {product.stock === 0 && (
            <span className={styles.outOfStock}>Out of Stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
