import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // AGREGAR PRODUCTO
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingProduct = prevItems.find(
        (item) => item.product_id === product.product_id
      );

      if (existingProduct) {
        return prevItems.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // ELIMINAR PRODUCTO
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product_id !== productId)
    );
  };

  // ACTUALIZAR CANTIDAD
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

  // LIMPIAR CARRITO
  const clearCart = () => {
    setCartItems([]);
  };

  // TOTAL DINERO
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.sale_price || 0) * item.quantity,
    0
  );

  // 🔥 TOTAL DE ARTÍCULOS (LO QUE NECESITAS PARA EL NAVBAR)
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
        cartCount, // ← IMPORTANTE
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}