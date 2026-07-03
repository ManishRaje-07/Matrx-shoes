import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import { FiHeart, FiTrash2, FiShoppingCart, FiArrowRight, FiStar } from 'react-icons/fi';
import styles from './Wishlist.module.css';

export const Wishlist: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart } = useShop();

  // Filter products in the wishlist
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    
    // Add default options
    const defaultSize = product.sizes[0] || 9;
    const defaultColor = product.colors[0] || '#000000';
    
    addToCart(productId, defaultSize, defaultColor, 1);
    // Remove from wishlist after moving to cart
    toggleWishlist(productId);
  };

  if (wishlist.length === 0) {
    return (
      <div className={styles.emptyPage}>
        <div className={styles.emptyContainer}>
          <div className={styles.iconCircle}>
            <FiHeart className={styles.emptyIcon} />
          </div>
          <h1>Your Wishlist is Empty</h1>
          <p>
            You haven't saved any items yet. Start browsing our catalog and tap the heart icon to save products to your wishlist.
          </p>
          <RouterLink to="/shop" className={styles.returnBtn}>
            <span>Explore Products</span>
            <FiArrowRight />
          </RouterLink>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContainer}>
          <span className={styles.subtitle}>SAVED ITEMS</span>
          <h1 className={styles.title}>My Wishlist</h1>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {wishlistProducts.map((product) => {
            const discountedPrice = product.price * (1 - product.discount / 100);
            return (
              <div key={product.id} className={styles.itemCard}>
                {/* Image Section */}
                <div className={styles.imageWrapper}>
                  <RouterLink to={`/product/${product.id}`}>
                    <img src={product.image} alt={product.name} className={styles.productImg} />
                  </RouterLink>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={styles.removeBtn}
                    title="Remove from Wishlist"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                {/* Info Section */}
                <div className={styles.info}>
                  <span className={styles.brand}>{product.brand}</span>
                  <RouterLink to={`/product/${product.id}`} className={styles.name}>
                    {product.name}
                  </RouterLink>

                  <div className={styles.ratingRow}>
                    <FiStar className={styles.starIcon} />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>

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
                  </div>

                  {/* Actions */}
                  <div className={styles.cardActions}>
                    <button
                      onClick={() => handleMoveToCart(product.id)}
                      className={styles.moveToCartBtn}
                      disabled={product.stock === 0}
                    >
                      <FiShoppingCart size={16} />
                      <span>{product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
