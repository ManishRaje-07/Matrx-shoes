import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCompass } from 'react-icons/fi';
import styles from './NotFound.module.css';

export const NotFound: React.FC = () => {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.container}>
        <div className={styles.iconCircle}>
          <FiCompass className={styles.icon} />
        </div>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorMessage}>Lost Your Trail?</h2>
        <p className={styles.desc}>
          Oops! It looks like you've wandered off-path. The page you are searching for doesn't exist in our catalog or has been moved to another coordinate.
        </p>
        <Link to="/" className={styles.homeBtn}>
          <FiHome />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
