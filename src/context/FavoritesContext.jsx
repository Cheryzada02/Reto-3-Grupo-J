import { createContext, useContext, useState } from "react";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (product) => {
    setFavorites((prev) => {
      const exists = prev.some(
        (item) => item.product_id === product.product_id
      );

      if (exists) return prev;

      return [...prev, product];
    });
  };

  const removeFavorite = (productId) => {
    setFavorites((prev) =>
      prev.filter((item) => item.product_id !== productId)
    );
  };

  const toggleFavorite = (product) => {
    const exists = favorites.some(
      (item) => item.product_id === product.product_id
    );

    if (exists) {
      removeFavorite(product.product_id);
    } else {
      addFavorite(product);
    }
  };

  const isFavorite = (productId) => {
    return favorites.some((item) => item.product_id === productId);
  };

  const favoritesCount = favorites.length;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        favoritesCount,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}