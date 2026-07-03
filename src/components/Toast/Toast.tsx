import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useShop, type Toast as ToastType } from '../../context/ShopContext';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import styles from './Toast.module.css';

interface ToastItemProps {
  toast: ToastType;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const { removeToast } = useShop();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheckCircle className={styles.iconSuccess} />;
      case 'error':
        return <FiAlertCircle className={styles.iconError} />;
      case 'info':
        return <FiInfo className={styles.iconInfo} />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, x: 50, transition: { duration: 0.2 } }}
      className={`${styles.toastItem} ${styles[toast.type]}`}
    >
      <div className={styles.toastContent}>
        {getIcon()}
        <span className={styles.message}>{toast.message}</span>
      </div>
      <button onClick={() => removeToast(toast.id)} className={styles.closeBtn}>
        <FiX size={16} />
      </button>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useShop();

  return (
    <div className={styles.toastContainer}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
export default ToastContainer;
