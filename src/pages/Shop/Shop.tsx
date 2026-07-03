import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShop } from '../../context/ShopContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { ShopSkeletonGrid } from '../../components/Skeleton/Skeleton';
import { FiSearch, FiSliders, FiX, FiInfo } from 'react-icons/fi';
import styles from './Shop.module.css';

export const Shop: React.FC = () => {
  const { products } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(250);
  const [sortBy, setSortBy] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize filters from URL params if present
  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategories([catParam]);
    }
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      setSelectedBrands([brandParam]);
    }
    
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Find min/max values dynamically from product data
  const { minProductPrice, maxProductPrice } = useMemo(() => {
    if (!products.length) return { minProductPrice: 0, maxProductPrice: 300 };
    const prices = products.map((p) => p.price);
    return {
      minProductPrice: Math.min(...prices),
      maxProductPrice: Math.max(...prices),
    };
  }, [products]);

  // Sync maxPrice range slider limit once products load
  useEffect(() => {
    if (products.length) {
      setMaxPrice(maxProductPrice);
    }
  }, [products, maxProductPrice]);

  // Categories list
  const categories = ['Running', 'Basketball', 'Lifestyle', 'Training'];
  // Brands list
  const brands = ['MartX', 'Nike', 'Adidas', 'Puma', 'Under Armour'];

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    triggerLoadingState();
  };

  // Handle brand toggle
  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    triggerLoadingState();
  };

  // Trigger brief loading skeleton for premium transition feel
  const triggerLoadingState = () => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(maxProductPrice);
    setSortBy('featured');
    setSearchParams({});
    triggerLoadingState();
  };

  // Apply Filters & Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Name search
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        
        // Category selection
        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(product.category);

        // Brand selection
        const matchesBrand =
          selectedBrands.length === 0 ||
          selectedBrands.includes(product.brand);

        // Price range (account for discounts)
        const finalPrice = product.price * (1 - product.discount / 100);
        const matchesPrice = finalPrice <= maxPrice;

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
      })
      .sort((a, b) => {
        const finalPriceA = a.price * (1 - a.discount / 100);
        const finalPriceB = b.price * (1 - b.discount / 100);

        switch (sortBy) {
          case 'price-low':
            return finalPriceA - finalPriceB;
          case 'price-high':
            return finalPriceB - finalPriceA;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
          default:
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
      });
  }, [products, searchQuery, selectedCategories, selectedBrands, maxPrice, sortBy]);

  return (
    <div className={styles.shopPage}>
      {/* Title Header */}
      <div className={styles.header}>
        <div className={styles.headerContainer}>
          <span className={styles.subtitle}>MARTX COLLECTION</span>
          <h1 className={styles.title}>All Sneakers</h1>
        </div>
      </div>

      <div className={styles.container}>
        {/* Mobile Filters Toggle bar */}
        <div className={styles.mobileFilterBar}>
          <button
            onClick={() => setShowMobileFilters(true)}
            className={styles.mobileFilterToggleBtn}
          >
            <FiSliders />
            <span>Filters & Sort</span>
          </button>
          <div className={styles.mobileCount}>
            {filteredProducts.length} Products Found
          </div>
        </div>

        {/* Sidebar Filters */}
        <aside
          className={`${styles.sidebar} ${
            showMobileFilters ? styles.sidebarOpen : ''
          }`}
        >
          <div className={styles.sidebarHeader}>
            <h3>Filters</h3>
            <button
              onClick={() => setShowMobileFilters(false)}
              className={styles.closeSidebarBtn}
            >
              <FiX size={20} />
            </button>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Search</h4>
            <div className={styles.searchBox}>
              <FiSearch className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search sneakers..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsLoading(true);
                  // Quick debounce style load
                  const t = setTimeout(() => setIsLoading(false), 300);
                  return () => clearTimeout(t);
                }}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Categories</h4>
            <div className={styles.checkboxGroup}>
              {categories.map((cat) => (
                <label key={cat} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkmark}></span>
                  <span className={styles.labelText}>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h4 className={styles.filterTitle}>Brands</h4>
            <div className={styles.checkboxGroup}>
              {brands.map((brand) => (
                <label key={brand} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandToggle(brand)}
                    className={styles.checkbox}
                  />
                  <span className={styles.checkmark}></span>
                  <span className={styles.labelText}>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.priceHeader}>
              <h4 className={styles.filterTitle}>Max Price</h4>
              <span className={styles.priceVal}>${maxPrice.toFixed(0)}</span>
            </div>
            <input
              type="range"
              min={minProductPrice}
              max={maxProductPrice}
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setIsLoading(true);
                const t = setTimeout(() => setIsLoading(false), 300);
                return () => clearTimeout(t);
              }}
              className={styles.priceSlider}
            />
            <div className={styles.sliderLimits}>
              <span>${minProductPrice}</span>
              <span>${maxProductPrice}</span>
            </div>
          </div>

          <button onClick={handleResetFilters} className={styles.resetBtn}>
            Reset All Filters
          </button>
        </aside>

        {/* Sidebar Overlay (Mobile only) */}
        {showMobileFilters && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setShowMobileFilters(false)}
          />
        )}

        {/* Main Grid Content */}
        <main className={styles.mainContent}>
          {/* Top Sort Controls */}
          <div className={styles.topControls}>
            <div className={styles.resultsCount}>
              <strong>{filteredProducts.length}</strong> products found
            </div>
            <div className={styles.sortControls}>
              <label htmlFor="sortBy" className={styles.sortLabel}>
                Sort By:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  triggerLoadingState();
                }}
                className={styles.sortSelect}
              >
                <option value="featured">Featured</option>
                <option value="newest">New Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Product Grid or Skeleton or Empty State */}
          {isLoading ? (
            <ShopSkeletonGrid count={8} />
          ) : filteredProducts.length > 0 ? (
            <div className={styles.grid}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiInfo className={styles.emptyIcon} />
              <h3>No products found</h3>
              <p>We couldn't find any products matching your active filters. Try adjusting your search query or reset filters.</p>
              <button onClick={handleResetFilters} className={styles.resetBtn} style={{ marginTop: '16px' }}>
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
