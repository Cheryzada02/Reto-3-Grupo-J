import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Share2, Flame, Eye, ShoppingCart } from "lucide-react";

import { get_products } from "../authentication/db_functions";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export default function ProductoDetalle() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [producto, setProducto] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await get_products();

        const activeProducts = data.filter(
          (item) => item.status === "Activo"
        );

        const foundProduct = activeProducts.find(
          (item) => item.product_id === Number(id)
        );

        const suggestedProducts = activeProducts
          .filter((item) => item.product_id !== Number(id))
          .slice(0, 4);

        setProducto(foundProduct || null);
        setRelatedProducts(suggestedProducts);
      } catch (error) {
        console.error("Error cargando producto:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));
  };

  const handleAddToCart = () => {
    if (!producto) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(producto);
    }
  };

  if (loading) {
    return <p className="estado">Cargando producto...</p>;
  }

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

  const stock = Number(producto.current_stock ?? producto.stock ?? 0);
  const favorito = isFavorite(producto.product_id);

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
          <div className="product-main-image">
            <span className="offer-badge">Oferta</span>

            <img
              src={producto.image_url || "/placeholder-product.png"}
              alt={producto.product_name}
            />
          </div>
        </div>

        <div className="surface-card product-detail-info">
          <div className="product-title-row">
            <h1>{producto.product_name}</h1>

            <button type="button" className="share-button">
              <Share2 size={20} />
              Compartir
            </button>
          </div>

          <p className="product-hot">
            <Flame size={20} />
            Producto disponible para retiro en tienda
          </p>

          <div className="product-meta">
            <p>
              <strong>Marca:</strong>{" "}
              {producto.brand || producto.supplier_name || "Ferretería Elupina"}
            </p>

            <p>
              <strong>SKU:</strong> {producto.sku || producto.product_id}
            </p>

            <p>
              <strong>Disponibilidad:</strong>{" "}
              {stock > 0 ? "En stock" : "Agotado"}
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
              <strong>CONDICIÓN:</strong> Retiro en tienda
            </p>

            <span>Pick Up</span>
          </div>

          <p className="detail-subtotal">
            Subtotal:{" "}
            <strong>
              {formatCurrency(Number(producto.sale_price) * quantity)}
            </strong>
          </p>

          <div className="detail-actions">
            <div>
              <label>Cantidad:</label>

              <input
                type="number"
                min="1"
                max={stock || 99}
                value={quantity}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setQuantity(value < 1 ? 1 : value);
                }}
              />
            </div>

            <button
              type="button"
              className="detail-cart-button"
              onClick={handleAddToCart}
              disabled={stock <= 0}
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
            Otros clientes están viendo este producto
          </p>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-products-section">
          <div className="related-products-header">
            <span>También podría interesarte</span>
            <h2>Productos relacionados</h2>
          </div>

          <div className="related-products-grid">
            {relatedProducts.map((item) => {
              const isRelatedFavorite = isFavorite(item.product_id);

              return (
                <article
                  className="surface-card interactive-card related-product-card"
                  key={item.product_id}
                >
                  <button
                    type="button"
                    className={
                      isRelatedFavorite
                        ? "icon-favorite-button related-favorite-button active"
                        : "icon-favorite-button related-favorite-button"
                    }
                    onClick={() => toggleFavorite(item)}
                    aria-label={
                      isRelatedFavorite
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
                    }
                  >
                    <Heart size={17} />
                  </button>

                  <Link
                    to={`/productos/${item.product_id}`}
                    className="related-product-image"
                  >
                    <img
                      src={item.image_url || "/placeholder-product.png"}
                      alt={item.product_name}
                      loading="lazy"
                    />
                  </Link>

                  <div className="related-product-body">
                    <Link to={`/productos/${item.product_id}`}>
                      <h3>{item.product_name}</h3>
                    </Link>

                    <p>{item.description}</p>

                    <strong>{formatCurrency(item.sale_price)}</strong>

                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      disabled={Number(item.current_stock || 0) <= 0}
                    >
                      <ShoppingCart size={16} />
                      {Number(item.current_stock || 0) > 0
                        ? "Agregar"
                        : "Agotado"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
