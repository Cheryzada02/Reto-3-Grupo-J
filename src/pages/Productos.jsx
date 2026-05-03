import { Heart } from "lucide-react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { get_products } from "../authentication/db_functions";

function ProductosPagina() {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const { departamentoRuta } = useParams();

  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("buscar")?.toLowerCase().trim() || "";
  const originalSearchText = searchParams.get("buscar") || "";

  const [productos, setProductos] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columnas, setColumnas] = useState(3);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));
  };

  const crearRutaDepartamento = (texto) => {
    return texto
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await get_products();

        const productosActivos = data.filter(
          (producto) => producto.status === "Activo"
        );

        setProductos(productosActivos);

        const deps = [
          ...new Map(
            productosActivos.map((p) => [
              p.department_id,
              {
                id: p.department_id,
                name: p.department_name,
                ruta: crearRutaDepartamento(p.department_name),
              },
            ])
          ).values(),
        ];

        setDepartamentos(deps);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const matchBusqueda =
      !searchText ||
      (producto.product_name?.toLowerCase() || "").includes(searchText) ||
      (producto.description?.toLowerCase() || "").includes(searchText) ||
      (producto.supplier_name?.toLowerCase() || "").includes(searchText);

    const rutaProducto = crearRutaDepartamento(producto.department_name);

    const matchDepartamento =
      !departamentoRuta || rutaProducto === departamentoRuta;

    return matchBusqueda && matchDepartamento;
  });

  const tituloPagina = departamentoRuta
    ? departamentos.find((dep) => dep.ruta === departamentoRuta)?.name ||
      "Departamento"
    : "Productos Disponibles";

  if (loading) {
    return <p className="estado">Cargando productos...</p>;
  }

  if (!productos.length) {
    return <p className="estado">No hay productos disponibles.</p>;
  }

  return (
    <main className="page-shell client-products-page">
      <section className="page-hero client-products-hero">
        <div>
          <span>Catalogo de productos</span>
          <h1>{tituloPagina}</h1>
          <p>Explora los productos disponibles y ajusta la vista a tu gusto.</p>
        </div>

        <div className="products-column-control" aria-label="Columnas de productos">
          {[1, 2, 3, 4].map((cantidad) => (
            <button
              key={cantidad}
              type="button"
              className={columnas === cantidad ? "active" : ""}
              onClick={() => setColumnas(cantidad)}
              aria-pressed={columnas === cantidad}
            >
              {cantidad}
            </button>
          ))}
        </div>
      </section>

      {searchText && (
        <p className="estado">
          Resultados para: <strong>{originalSearchText}</strong>
        </p>
      )}

      <div className="client-products-layout">
        <aside className="client-departments-sidebar">
          <h3>Departamentos</h3>

          <ul>
            <li className={!departamentoRuta ? "active" : ""}>
              <Link to="/productos">Todos</Link>
            </li>

            {departamentos.map((dep) => (
              <li
                key={dep.id}
                className={departamentoRuta === dep.ruta ? "active" : ""}
              >
                <Link to={`/departamentos/${dep.ruta}`}>{dep.name}</Link>
              </li>
            ))}
          </ul>
        </aside>

        {!productosFiltrados.length ? (
          <p className="estado">No encontramos productos con esa búsqueda.</p>
        ) : (
          <div
            className={`responsive-grid client-products-grid client-products-grid-${columnas}`}
          >
            {productosFiltrados.map((producto) => {
              const favorito = isFavorite(producto.product_id);

              return (
                <article
                  className="surface-card interactive-card client-product-card"
                  key={producto.product_id}
                >
                  <button
                    type="button"
                    className={
                      favorito
                        ? "icon-favorite-button client-favorite-button active"
                        : "icon-favorite-button client-favorite-button"
                    }
                    onClick={() => toggleFavorite(producto)}
                    aria-label={
                      favorito
                        ? "Quitar de favoritos"
                        : "Agregar a favoritos"
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
      </div>
    </main>
  );
}

export default ProductosPagina;
