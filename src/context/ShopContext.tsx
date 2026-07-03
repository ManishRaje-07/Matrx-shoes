import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import productsData from '../data/products.json';

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  rating: number;
  reviews: Review[];
  sizes: number[];
  colors: string[];
  stock: number;
  image: string;
  featured: boolean;
  newArrival: boolean;
}

export interface CartItem {
  id: number;
  size: number;
  color: string;
  quantity: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: number[];
  theme: 'light' | 'dark';
  toasts: Toast[];
  isLoggedIn: boolean;
  userEmail: string | null;
  userOrders: any[];
  toggleTheme: () => void;
  addToCart: (id: number, size: number, color: string, quantity?: number) => void;
  removeFromCart: (id: number, size: number, color: string) => void;
  updateQuantity: (id: number, size: number, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  login: (email: string) => void;
  logout: () => void;
  fetchUserOrders: () => void;
  cartCount: number;
  cartTotal: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(productsData as Product[]);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  // Retrieve initial states from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('martx_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [wishlist, setWishlist] = useState<number[]>(() => {
    const savedWishlist = localStorage.getItem('martx_wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('martx_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Auth States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('martx_logged_in') === 'true';
  });

  const [userEmail, setUserEmail] = useState<string | null>(() => {
    return localStorage.getItem('martx_user_email');
  });

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem('martx_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('martx_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Apply theme to document body
  useEffect(() => {
    localStorage.setItem('martx_theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => {
      const filtered = prev.filter((t) => t.message !== message);
      return [...filtered, { id, message, type }];
    });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    addToast(`Switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode`, 'info');
  };

  // Auth Functions
  const login = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    localStorage.setItem('martx_logged_in', 'true');
    localStorage.setItem('martx_user_email', email);
    addToast('Logged in successfully!', 'success');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    localStorage.removeItem('martx_logged_in');
    localStorage.removeItem('martx_user_email');
    addToast('Logged out successfully.', 'info');
  };

  // Fetch fresh products list from API server on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch {
        console.error('Failed to fetch products from backend API');
      }
    };
    fetchProducts();
  }, []);

  // Fetch orders when login status changes
  const fetchUserOrders = useCallback(async () => {
    if (!isLoggedIn || !userEmail) return;
    try {
      const response = await fetch(`http://localhost:5000/api/orders/user/${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        setUserOrders(data);
      }
    } catch {
      console.error('Failed to fetch user orders');
    }
  }, [isLoggedIn, userEmail]);

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  // Cart operations
  const addToCart = (id: number, size: number, color: string, quantity = 1) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (product.stock === 0) {
      addToast('Sorry, this product is out of stock!', 'error');
      return;
    }

    const existingItem = cart.find(
      (item) => item.id === id && item.size === size && item.color === color
    );

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + quantity;
      if (updatedQuantity > product.stock) {
        addToast(`Cannot add more. Only ${product.stock} items in stock.`, 'error');
        return;
      }
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id && item.size === size && item.color === color
            ? { ...item, quantity: updatedQuantity }
            : item
        )
      );
      addToast(`Added ${product.name} to cart!`, 'success');
    } else {
      if (quantity > product.stock) {
        addToast(`Cannot add. Only ${product.stock} items in stock.`, 'error');
        return;
      }
      setCart((prevCart) => [...prevCart, { id, size, color, quantity }]);
      addToast(`Added ${product.name} to cart!`, 'success');
    }
  };

  const removeFromCart = (id: number, size: number, color: string) => {
    const product = products.find((p) => p.id === id);
    const productName = product ? product.name : 'Item';
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.id === id && item.size === size && item.color === color)
    ));
    addToast(`${productName} removed from cart.`, 'info');
  };

  const updateQuantity = (id: number, size: number, color: string, quantity: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    if (quantity > product.stock) {
      addToast(`Only ${product.stock} items in stock.`, 'error');
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    addToast('Cart cleared.', 'info');
  };

  // Wishlist operations
  const toggleWishlist = (id: number) => {
    const product = products.find((p) => p.id === id);
    const productName = product ? product.name : 'Item';

    setWishlist((prevWishlist) => {
      const exists = prevWishlist.includes(id);
      if (exists) {
        addToast(`${productName} removed from wishlist.`, 'info');
        return prevWishlist.filter((wId) => wId !== id);
      } else {
        addToast(`${productName} added to wishlist!`, 'success');
        return [...prevWishlist, id];
      }
    });
  };

  const isInWishlist = (id: number) => wishlist.includes(id);

  // Cart Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return total;
    const finalPrice = product.price * (1 - product.discount / 100);
    return total + finalPrice * item.quantity;
  }, 0);

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        theme,
        toasts,
        isLoggedIn,
        userEmail,
        userOrders,
        toggleTheme,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        addToast,
        removeToast,
        login,
        logout,
        fetchUserOrders,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

// eslint-disable-next-line react/only-export-components
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
