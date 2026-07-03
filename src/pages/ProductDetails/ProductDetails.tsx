import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop, type Product } from '../../context/ShopContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiStar, FiChevronRight } from 'react-icons/fi';
import styles from './ProductDetails.module.css';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, isInWishlist, addToast } = useShop();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews'>('desc');

  useEffect(() => {
    if (!id) return;
    const foundProduct = products.find((p) => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.image);
      setSelectedSize(foundProduct.sizes[0] || null);
      setSelectedColor(foundProduct.colors[0] || null);
      setQuantity(1);
    } else {
      // Product not found, send to 404
      navigate('/404');
    }
  }, [id, products, navigate]);

  if (!product) {
    return <div className={styles.loading}>Loading product details...</div>;
  }

  const isLiked = isInWishlist(product.id);
  const discountedPrice = product.price * (1 - product.discount / 100);

  // Generate a couple of alternative dummy thumbnail views for the image gallery
  const galleryImages = [
    product.image,
    // Swap dimensions or add unsplash params for different cropped angles
    product.image + '&auto=format&fit=crop&w=400&q=60&sig=1',
    product.image + '&auto=format&fit=crop&w=400&q=60&sig=2',
  ];

  const handleAddToCart = () => {
    if (selectedSize === null) {
      addToast('Please select a shoe size.', 'error');
      return;
    }
    if (selectedColor === null) {
      addToast('Please select a color.', 'error');
      return;
    }
    addToCart(product.id, selectedSize, selectedColor, quantity);
  };

  // Find related products (same category, excluding this one, limit to 4)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className={styles.detailsPage}>
      {/* Breadcrumbs */}
      <div className={styles.breadcrumbs}>
        <div className={styles.breadContainer}>
          <Link to="/">Home</Link>
          <FiChevronRight className={styles.breadIcon} />
          <Link to="/shop">Shop</Link>
          <FiChevronRight className={styles.breadIcon} />
          <span className={styles.breadActive}>{product.name}</span>
        </div>
      </div>

      <div className={styles.container}>
        {/* Left Side: Image Gallery */}
        <div className={styles.gallery}>
          <div className={styles.mainImageWrapper}>
            <img src={activeImage} alt={product.name} className={styles.mainImage} />
          </div>
          <div className={styles.thumbnails}>
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(imgUrl)}
                className={`${styles.thumbBtn} ${
                  activeImage === imgUrl ? styles.thumbActive : ''
                }`}
              >
                <img src={product.image} alt="Thumbnail View" className={styles.thumbImg} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Options & Add */}
        <div className={styles.info}>
          <div className={styles.metaRow}>
            <span className={styles.brand}>{product.brand}</span>
            <span className={styles.category}>{product.category}</span>
          </div>

          <h1 className={styles.name}>{product.name}</h1>

          {/* Rating */}
          <div className={styles.ratingSection}>
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar
                  key={i}
                  className={`${styles.starIcon} ${
                    i < Math.floor(product.rating) ? styles.starFilled : ''
                  }`}
                />
              ))}
            </div>
            <span className={styles.ratingVal}>
              <strong>{product.rating.toFixed(1)}</strong> ({product.reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className={styles.priceRow}>
            {product.discount > 0 ? (
              <div className={styles.prices}>
                <span className={styles.priceDiscounted}>
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className={styles.priceOriginal}>
                  ${product.price.toFixed(2)}
                </span>
                <span className={styles.discountBadge}>
                  SAVE {product.discount}%
                </span>
              </div>
            ) : (
              <span className={styles.price}>${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className={styles.brief}>{product.description}</p>

          {/* Color Selector */}
          <div className={styles.optionSection}>
            <h3 className={styles.optionTitle}>Select Color</h3>
            <div className={styles.colorsGrid}>
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`${styles.colorChip} ${
                    selectedColor === color ? styles.colorActive : ''
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className={styles.optionSection}>
            <div className={styles.optionHeader}>
              <h3 className={styles.optionTitle}>Select Size (US Men)</h3>
              <a href="#" onClick={(e) => { e.preventDefault(); addToast('Standard US Men sizing fits true to size.', 'info'); }} className={styles.sizeGuideLink}>
                Size Guide
              </a>
            </div>
            <div className={styles.sizesGrid}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`${styles.sizeChip} ${
                    selectedSize === size ? styles.sizeActive : ''
                  }`}
                >
                  US {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className={styles.actionSection}>
            <div className={styles.quantitySelector}>
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className={styles.qtyBtn}
                aria-label="Decrease quantity"
              >
                <FiMinus />
              </button>
              <span className={styles.qtyVal}>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className={styles.qtyBtn}
                aria-label="Increase quantity"
                disabled={quantity >= product.stock}
              >
                <FiPlus />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={styles.addToCartBtn}
              disabled={product.stock === 0}
            >
              <FiShoppingCart size={18} />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`${styles.wishlistBtn} ${isLiked ? styles.wishlistActive : ''}`}
              aria-label="Toggle Wishlist"
            >
              <FiHeart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Stock Notification */}
          <div className={styles.stockStatus}>
            {product.stock === 0 ? (
              <span className={styles.outOfStock}>Out of Stock</span>
            ) : product.stock <= 3 ? (
              <span className={styles.lowStock}>Only {product.stock} items left in stock - order soon!</span>
            ) : (
              <span className={styles.inStock}>In Stock ({product.stock} units available)</span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Section for Specs & Reviews */}
      <section className={styles.tabsSection}>
        <div className={styles.tabsContainer}>
          <div className={styles.tabsHeader}>
            <button
              onClick={() => setActiveTab('desc')}
              className={`${styles.tabBtn} ${activeTab === 'desc' ? styles.tabActive : ''}`}
            >
              Details & Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.tabActive : ''}`}
            >
              Reviews ({product.reviews.length})
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'desc' ? (
              <div className={styles.specsTab}>
                <p>{product.description}</p>
                <ul className={styles.specsList}>
                  <li>
                    <strong>Category:</strong>
                    <span>{product.category} Footwear</span>
                  </li>
                  <li>
                    <strong>Brand Origin:</strong>
                    <span>Premium Sports Engineering</span>
                  </li>
                  <li>
                    <strong>Upper Materials:</strong>
                    <span>Engineered stretch knit mesh / Leather accents</span>
                  </li>
                  <li>
                    <strong>Midsole Cushions:</strong>
                    <span>Super-rebound dynamic foam</span>
                  </li>
                  <li>
                    <strong>Traction System:</strong>
                    <span>Multi-directional high-density vulcanized rubber</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className={styles.reviewsTab}>
                {product.reviews.length > 0 ? (
                  <div className={styles.reviewsList}>
                    {product.reviews.map((rev) => (
                      <div key={rev.id} className={styles.reviewCard}>
                        <div className={styles.revHeader}>
                          <div className={styles.revUser}>
                            <strong>{rev.name}</strong>
                            <div className={styles.revStars}>
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <FiStar key={i} className={styles.starFilled} />
                              ))}
                            </div>
                          </div>
                          <span className={styles.revDate}>{rev.date}</span>
                        </div>
                        <p className={styles.revComment}>{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noReviews}>No customer reviews yet. Be the first to leave one!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.relatedContainer}>
            <h2 className={styles.relatedTitle}>Related Products</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
