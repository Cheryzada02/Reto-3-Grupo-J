import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Share2, Flame, Eye } from "lucide-react";
import { productos } from "./Productos";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export default function ProductoDetalle() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const producto = productos.find(
    (item) => item.product_id === Number(id)
  );

  const [quantity, setQuantity] = useState(1);

  if (!producto) {
    return (
      <main className="product-detail-page">
        <h1>Producto no encontrado</h1>
        <Link to="/productos" className="btn">
          Volver a productos
        </Link>
      </main>
    );
  }

  const favorito = isFavorite(producto.product_id);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(value);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(producto);
    }
  };

  return (
    <main className="product-detail-page">
      <div className="breadcrumb">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/productos">Productos</Link>
        <span>/</span>
        <strong>{producto.product_name}</strong>
      </div>

      <section className="product-detail-layout">
        <div className="product-detail-gallery">
          <div className="product-thumbs">
            <img src={producto.image_url} alt={producto.product_name} />
            <img src={producto.image_url} alt={producto.product_name} />
            <img src={producto.image_url} alt={producto.product_name} />
          </div>

          <div className="product-main-image">
            <span className="offer-badge">Oferta</span>
            <img src={producto.image_url} alt={producto.product_name} />
          </div>
        </div>

        <div className="product-detail-info">
          <div className="product-title-row">
            <h1>{producto.product_name}</h1>

            <button type="button" className="share-button">
              <Share2 size={20} />
              Compartir
            </button>
          </div>

          <p className="product-hot">
            <Flame size={20} />
            6 vendidos en las últimas 25 horas
          </p>

          <div className="product-meta">
            <p>
              <strong>Marca:</strong> {producto.brand || "Ferretería Elupina"}
            </p>
            <p>
              <strong>SKU:</strong> {producto.sku || producto.product_id}
            </p>
            <p>
              <strong>Disponibilidad:</strong>{" "}
              {producto.stock > 0 ? "En stock" : "Agotado"}
            </p>
          </div>

          <div className="product-description">
            <p>{producto.description}</p>
          </div>

          <div className="product-prices">
            {producto.old_price && (
              <span className="old-price">
                {formatCurrency(producto.old_price)}
              </span>
            )}

            <span className="detail-price">
              {formatCurrency(producto.sale_price)}
            </span>
          </div>

          <div className="product-option">
            <p>
              <strong>CAPACIDAD-USO:</strong> General
            </p>

            <span>Disponible</span>
          </div>

          <p className="detail-subtotal">
            Subtotal:{" "}
            <strong>{formatCurrency(producto.sale_price * quantity)}</strong>
          </p>

          <div className="detail-actions">
            <div>
              <label>Cantidad:</label>
              <input
                type="number"
                min="1"
                max={producto.stock || 99}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            <button
              type="button"
              className="detail-cart-button"
              onClick={handleAddToCart}
              disabled={producto.stock <= 0}
            >
              Añadir al carrito
            </button>

            <button
              type="button"
              className={favorito ? "detail-heart active" : "detail-heart"}
              onClick={() => toggleFavorite(producto)}
            >
              <Heart size={24} />
            </button>
          </div>

          <p className="watching-product">
            <Eye size={20} />
            46 clientes están viendo este producto
          </p>
        </div>
      </section>
    </main>
  );
}