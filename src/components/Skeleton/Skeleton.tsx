import React from 'react';
import styles from './Skeleton.module.css';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className={styles.cardSkeleton}>
      <div className={`${styles.imageSkeleton} skeleton`} />
      <div className={styles.infoSkeleton}>
        <div className={styles.rowSkeleton}>
          <div className={`${styles.brandSkeleton} skeleton`} />
          <div className={`${styles.ratingSkeleton} skeleton`} />
        </div>
        <div className={`${styles.titleSkeleton} skeleton`} />
        <div className={`${styles.categorySkeleton} skeleton`} />
        <div className={styles.rowSkeleton} style={{ marginTop: '12px' }}>
          <div className={`${styles.priceSkeleton} skeleton`} />
          <div className={`${styles.badgeSkeleton} skeleton`} />
        </div>
      </div>
    </div>
  );
};

export const ShopSkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
