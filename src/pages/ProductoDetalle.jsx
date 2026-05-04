import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Share2, Flame, Eye, ShoppingCart } from "lucide-react";

import { get_products } from "../authentication/db_functions";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { useAlerts } from "../context/AlertContext";

export default function ProductoDetalle() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showAlert } = useAlerts();

  const [producto, setProducto] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [shareLabel, setShareLabel] = useState("Compartir");

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

  const getStockInfo = (product) => {
    const stock = Number(product.current_stock ?? product.stock ?? 0);
    const minStock = Number(product.min_stock ?? 0);

    return {
      stock,
      hasStock: stock > 0,
      isLowStock: stock > 0 && minStock > 0 && stock <= minStock,
      label: stock === 1 ? "Queda 1 unidad" : `Quedan ${stock} unidades`,
    };
  };

  const handleAddToCart = () => {
    if (!producto) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(producto);
    }
  };

  const handleShare = async () => {
    if (!producto) return;

    const shareUrl = window.location.href;
    const shareData = {
      title: producto.product_name,
      text: `Mira este producto: ${producto.product_name}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareLabel("Compartido");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setShareLabel("Enlace copiado");
        showAlert("Enlace del producto copiado.", "success");
      } else {
        window.prompt("Copia este enlace:", shareUrl);
        setShareLabel("Copiar enlace");
      }

      window.setTimeout(() => setShareLabel("Compartir"), 2200);
    } catch (error) {
      if (error.name !== "AbortError") {
        showAlert("No se pudo compartir el producto.", "error");
      }
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

  const stockInfo = getStockInfo(producto);
  const stock = stockInfo.stock;
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

            <button
              type="button"
              className="share-button"
              onClick={handleShare}
              aria-label={`Compartir ${producto.product_name}`}
            >
              <Share2 size={20} />
              {shareLabel}
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
              {!stockInfo.hasStock
                ? "Agotado"
                : stockInfo.isLowStock
                  ? "Pocas unidades"
                  : "En stock"}
            </p>
          </div>

          {stockInfo.isLowStock && (
            <div className="product-low-stock-alert">
              {stockInfo.label} disponibles.
            </div>
          )}

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
              const relatedStockInfo = getStockInfo(item);

              return (
                <article
                  className="surface-card interactive-card related-product-card"
                  key={item.product_id}
                >
                  {!relatedStockInfo.hasStock ? (
                    <span className="client-stock-badge sold-out">Agotado</span>
                  ) : relatedStockInfo.isLowStock ? (
                    <span className="client-stock-badge low-stock">
                      Pocas unidades
                    </span>
                  ) : null}

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
                      disabled={!relatedStockInfo.hasStock}
                    >
                      <ShoppingCart size={16} />
                      {relatedStockInfo.hasStock ? "Agregar" : "Agotado"}
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
