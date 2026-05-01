import { Heart } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { get_products } from "../authentication/db_functions";

function ProductosPagina() {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("buscar")?.toLowerCase().trim() || "";
  const originalSearchText = searchParams.get("buscar") || "";

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await get_products();

        const productosActivos = data.filter(
          (producto) => producto.status === "Activo"
        );

        setProductos(productosActivos);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    if (!searchText) return true;

    const nombre = producto.product_name?.toLowerCase() || "";
    const descripcion = producto.description?.toLowerCase() || "";
    const suplidor = producto.supplier_name?.toLowerCase() || "";

    return (
      nombre.includes(searchText) ||
      descripcion.includes(searchText) ||
      suplidor.includes(searchText)
    );
  });

  if (loading) {
    return <p className="estado">Cargando productos...</p>;
  }

  if (!productos.length) {
    return <p className="estado">No hay productos disponibles.</p>;
  }

  return (
    <main className="client-products-page">
      <h1>Productos Disponibles</h1>

      {searchText && (
        <p className="estado">
          Resultados para: <strong>{originalSearchText}</strong>
        </p>
      )}

      {!productosFiltrados.length ? (
        <p className="estado">No encontramos productos con esa búsqueda.</p>
      ) : (
        <div className="client-products-grid">
          {productosFiltrados.map((producto) => {
            const favorito = isFavorite(producto.product_id);

            return (
              <article
                className="client-product-card"
                key={producto.product_id}
              >
                <button
                  type="button"
                  className={
                    favorito
                      ? "client-favorite-button active"
                      : "client-favorite-button"
                  }
                  onClick={() => toggleFavorite(producto)}
                  aria-label={
                    favorito ? "Quitar de favoritos" : "Agregar a favoritos"
                  }
                >
                  <Heart size={18} />
                </button>

                <Link
                  to={`/productos/${producto.product_id}`}
                  className="client-product-image"
                >
                  <img
                    src={producto.image_url || "/placeholder-product.png"}
                    alt={producto.product_name}
                    loading="lazy"
                  />
                </Link>

                <div className="client-product-body">
                  <Link to={`/productos/${producto.product_id}`}>
                    <h3>{producto.product_name}</h3>
                  </Link>

                  <p>{producto.description}</p>

                  <div className="client-product-price">
                    {formatCurrency(producto.sale_price)}
                  </div>

                  <button
                    type="button"
                    className="client-product-button"
                    onClick={() => addToCart(producto)}
                    disabled={Number(producto.current_stock || 0) <= 0}
                  >
                    {Number(producto.current_stock || 0) > 0
                      ? "Agregar al carrito"
                      : "Agotado"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default ProductosPagina;