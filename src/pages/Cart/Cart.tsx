import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useShop } from "../../context/ShopContext";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";
import styles from "./Cart.module.css";

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    products,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    addToast,
    isLoggedIn,
    userEmail,
    userOrders,
  } = useShop();

  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Pricing calculations
  const subtotal = cartTotal;
  const promoDiscount = subtotal * (discountPercent / 100);
  const taxedSubtotal = subtotal - promoDiscount;
  const shippingThreshold = 150;
  const shipping =
    taxedSubtotal >= shippingThreshold || taxedSubtotal === 0 ? 0 : 15.0;
  const tax = taxedSubtotal * 0.08;
  const grandTotal = taxedSubtotal + shipping + tax;

  // Apply simulated promo coupon code
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      addToast("Please enter a coupon code.", "error");
      return;
    }

    if (promoCode.trim().toUpperCase() === "MARTX10") {
      setDiscountPercent(10);
      addToast(
        "Promo code applied successfully! 10% discount applied.",
        "success",
      );
    } else {
      addToast('Invalid promo code. Try "MARTX10".', "error");
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn || !userEmail) {
      addToast("Please log in to complete your checkout.", "error");
      navigate("/login?redirect=/cart");
      return;
    }

    const orderData = {
      email: userEmail,
      items: cart.map((item) => {
        const product = products.find((p) => p.id === item.id);
        return {
          id: item.id,
          name: product ? product.name : "Unknown Product",
          size: item.size,
          color: item.color,
          price: product ? product.price * (1 - product.discount / 100) : 0,
          quantity: item.quantity,
        };
      }),
      subtotal,
      discount: promoDiscount,
      shipping,
      tax,
      total: grandTotal,
    };

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        addToast("Checkout successful! Your order has been placed.", "success");
        clearCart();
        setDiscountPercent(0);
      } else {
        const errorData = await response.json();
        addToast(
          errorData.error || "Checkout failed. Please try again.",
          "error",
        );
      }
    } catch {
      addToast("Failed to connect to checkout server.", "error");
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCartPage}>
        <div className={styles.emptyContainer}>
          <div className={styles.iconCircle}>
            <FiShoppingBag className={styles.emptyIcon} />
          </div>
          <h1>Your Cart is Empty</h1>
          <p>
            Looks like you haven't added anything to your cart yet. Head over to
            our catalog and discover our premium shoes.
          </p>
          <Link to="/shop" className={styles.returnBtn}>
            <span>Go to Shop</span>
            <FiArrowRight />
          </Link>
        </div>

        {/* Order History Section */}
        {isLoggedIn && userOrders && userOrders.length > 0 && (
          <div className={styles.orderHistorySection}>
            <h2 className={styles.orderHistoryTitle}>Your Order History</h2>
            <div className={styles.orderList}>
              {userOrders.map((order: any) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderHeaderMeta}>
                      <span className={styles.orderId}>{order.id}</span>
                      <span className={styles.orderDate}>
                        Ordered on {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className={`${styles.orderStatus} ${styles.processing}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className={styles.orderItems}>
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className={styles.orderItem}>
                        <div className={styles.orderItemDetails}>
                          <span className={styles.orderItemName}>
                            {item.name}
                          </span>
                          <span className={styles.orderItemMeta}>
                            Size: {item.size} | Color:{" "}
                            <span
                              className={styles.colorIndicator}
                              style={{ backgroundColor: item.color }}
                            ></span>
                          </span>
                        </div>
                        <span className={styles.orderItemPrice}>
                          {item.quantity} x ${item.price.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.orderFooter}>
                    <span>Total Amount:</span>
                    <span className={styles.orderTotal}>
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContainer}>
          <span className={styles.subtitle}>SHOPPING BAG</span>
          <h1 className={styles.title}>Your Cart</h1>
        </div>
      </div>

      <div className={styles.container}>
        {/* Left Side: Cart Items Table */}
        <div className={styles.itemsCol}>
          <div className={styles.tableHeader}>
            <span className={styles.thProduct}>Product</span>
            <span className={styles.thPrice}>Price</span>
            <span className={styles.thQty}>Quantity</span>
            <span className={styles.thSubtotal}>Total</span>
            <span className={styles.thRemove}></span>
          </div>

          <div className={styles.itemsList}>
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return null;

              const finalPrice = product.price * (1 - product.discount / 100);
              const itemSubtotal = finalPrice * item.quantity;

              return (
                <div
                  key={`${item.id}-${item.size}-${item.color}`}
                  className={styles.cartRow}
                >
                  {/* Product details info */}
                  <div className={styles.productCell}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={styles.itemImg}
                    />
                    <div className={styles.itemMeta}>
                      <Link
                        to={`/product/${product.id}`}
                        className={styles.itemName}
                      >
                        {product.name}
                      </Link>
                      <span className={styles.itemBrand}>{product.brand}</span>
                      <div className={styles.itemSpecs}>
                        <span>
                          Size:{" "}
                          <strong style={{ color: "var(--text-primary)" }}>
                            US {item.size}
                          </strong>
                        </span>
                        <span className={styles.specDivider}>|</span>
                        <span className={styles.colorRow}>
                          Color:
                          <span
                            className={styles.colorDot}
                            style={{ backgroundColor: item.color }}
                          />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Unit price */}
                  <div className={styles.priceCell}>
                    {product.discount > 0 ? (
                      <div className={styles.priceContainer}>
                        <span className={styles.itemPriceDiscounted}>
                          ${finalPrice.toFixed(2)}
                        </span>
                        <span className={styles.itemPriceOriginal}>
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span className={styles.itemPrice}>
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Quantity selector */}
                  <div className={styles.qtyCell}>
                    <div className={styles.qtyWrapper}>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.size,
                            item.color,
                            item.quantity - 1,
                          )
                        }
                        className={styles.qtyBtn}
                        aria-label="Decrease quantity"
                      >
                        <FiMinus />
                      </button>
                      <span className={styles.qtyVal}>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.size,
                            item.color,
                            item.quantity + 1,
                          )
                        }
                        className={styles.qtyBtn}
                        aria-label="Increase quantity"
                        disabled={item.quantity >= product.stock}
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal row */}
                  <div className={styles.subtotalCell}>
                    ${itemSubtotal.toFixed(2)}
                  </div>

                  {/* Delete Button */}
                  <div className={styles.removeCell}>
                    <button
                      onClick={() =>
                        removeFromCart(item.id, item.size, item.color)
                      }
                      className={styles.trashBtn}
                      title="Remove Item"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.cartActions}>
            <Link to="/shop" className={styles.continueShopLink}>
              &larr; Continue Shopping
            </Link>
            <button onClick={clearCart} className={styles.clearCartBtn}>
              Clear Cart
            </button>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className={styles.summaryCol}>
          <div className={styles.summaryCard}>
            <h2>Order Summary</h2>

            {/* Calculations List */}
            <div className={styles.calcList}>
              <div className={styles.calcRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountPercent > 0 && (
                <div className={`${styles.calcRow} ${styles.discountRow}`}>
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className={styles.calcRow}>
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className={styles.shippingNotice}>
                  Add{" "}
                  <strong>${(shippingThreshold - subtotal).toFixed(2)}</strong>{" "}
                  more for free shipping!
                </p>
              )}

              <div className={styles.calcRow}>
                <span>Estimated Sales Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className={`${styles.calcRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className={styles.promoForm}>
              <input
                type="text"
                placeholder="Promo Code (MARTX10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className={styles.promoInput}
              />
              <button type="submit" className={styles.promoBtn}>
                Apply
              </button>
            </form>

            {/* Checkout Button */}
            <button onClick={handleCheckout} className={styles.checkoutBtn}>
              <span>Proceed to Checkout</span>
              <FiArrowRight />
            </button>

            <div className={styles.securityBadge}>
              <FiCheck className={styles.securityCheck} />
              <span>PCI Compliant SSL Secured Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
