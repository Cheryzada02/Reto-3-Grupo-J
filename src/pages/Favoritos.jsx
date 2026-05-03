import { Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
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
    <main className="page-shell favorites-page">
      <section className="favorites-header">
        <h1>Mis favoritos</h1>
        <p>
          Guarda aquí los productos que te interesan para comprarlos más tarde.
        </p>
      </section>

      {favorites.length === 0 ? (
        <section className="surface-card empty-state favorites-empty">
          <h2>No tienes productos favoritos</h2>
          <p>Explora nuestros productos y agrega tus artículos preferidos.</p>
        </section>
      ) : (
        <section className="responsive-grid favorites-grid">
          {favorites.map((product) => (
            <article
              className="surface-card interactive-card client-product-card favorite-card"
              key={product.product_id}
            >
              <Link
                to={`/productos/${product.product_id}`}
                className="client-product-image favorite-image"
              >
                <img
                  src={product.image_url || "/placeholder-product.png"}
                  alt={product.product_name}
                  loading="lazy"
                />
              </Link>

              <div className="client-product-body favorite-info">
                <Link to={`/productos/${product.product_id}`}>
                  <h3>{product.product_name}</h3>
                </Link>
                <p>{product.description}</p>

                <div className="client-product-price favorite-price">
                  {formatCurrency(product.sale_price)}
                </div>

                <div className="favorite-actions">
                  <button
                    type="button"
                    className="client-product-button"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart size={17} />
                    Agregar al carrito
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
