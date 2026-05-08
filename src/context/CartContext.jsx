import { createContext, useContext, useState } from "react";
import { useAlerts } from "./AlertContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { showAlert } = useAlerts();

  const addToCart = (product, quantity = 1) => {
    const quantityToAdd = Math.max(1, Number(quantity) || 1);

    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(
        (item) => item.product_id === product.product_id
      );

      if (existingProduct) {
        return prevItems.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: quantityToAdd }];
    });

    showAlert("Producto agregado al carrito correctamente.", "success");
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };


  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.sale_price || 0) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
