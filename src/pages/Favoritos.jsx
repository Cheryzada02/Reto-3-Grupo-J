import { Trash2, ShoppingCart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";

export default function Favoritos() {
  const { favorites, removeFavorite } = useFavorites();
  const { addToCart } = useCart();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(value);
  };

  return (
    <main className="favorites-page">
      <section className="favorites-header">
        <h1>Mis favoritos</h1>
        <p>
          Guarda aquí los productos que te interesan para comprarlos más tarde.
        </p>
      </section>

      {favorites.length === 0 ? (
        <section className="favorites-empty">
          <h2>No tienes productos favoritos</h2>
          <p>Explora nuestros productos y agrega tus artículos preferidos.</p>
        </section>
      ) : (
        <section className="favorites-grid">
          {favorites.map((product) => (
            <article className="favorite-card" key={product.product_id}>
              <img
                src={product.image_url || "/placeholder-product.png"}
                alt={product.product_name}
                className="favorite-image"
              />

              <div className="favorite-info">
                <h2>{product.product_name}</h2>
                <p>{product.description}</p>

                <span className="favorite-price">
                  {formatCurrency(product.sale_price)}
                </span>

                <div className="favorite-actions">
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={17} />
                    Agregar
                  </button>

                  <button
                    type="button"
                    className="favorite-remove"
                    onClick={() => removeFavorite(product.product_id)}
                  >
                    <Trash2 size={17} />
                    Quitar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}