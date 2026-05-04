import { Heart } from "lucide-react";
import { Link, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

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
  const [ordenProductos, setOrdenProductos] = useState("az");
  const [precioMaximoFiltro, setPrecioMaximoFiltro] = useState(0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));
  };

  const getStockInfo = (producto) => {
    const stock = Number(producto.current_stock ?? producto.stock ?? 0);
    const minStock = Number(producto.min_stock ?? 0);

    return {
      stock,
      hasStock: stock > 0,
      isLowStock: stock > 0 && minStock > 0 && stock <= minStock,
      label: stock === 1 ? "Queda 1 unidad" : `Quedan ${stock} unidades`,
    };
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
        const precioMaximoInventario = Math.ceil(
          Math.max(
            0,
            ...productosActivos.map((producto) =>
              Number(producto.sale_price || 0)
            )
          )
        );

        setProductos(productosActivos);
        setPrecioMaximoFiltro(precioMaximoInventario);

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

  const precioMaximoInventario = useMemo(
    () =>
      Math.ceil(
        Math.max(
          0,
          ...productos.map((producto) => Number(producto.sale_price || 0))
        )
      ),
    [productos]
  );

  const productosFiltrados = useMemo(() => {
    return productos
      .filter((producto) => {
        const matchBusqueda =
          !searchText ||
          (producto.product_name?.toLowerCase() || "").includes(searchText) ||
          (producto.description?.toLowerCase() || "").includes(searchText) ||
          (producto.supplier_name?.toLowerCase() || "").includes(searchText);

        const rutaProducto = crearRutaDepartamento(producto.department_name);

        const matchDepartamento =
          !departamentoRuta || rutaProducto === departamentoRuta;

        const matchPrecio =
          Number(producto.sale_price || 0) <= precioMaximoFiltro;

        return matchBusqueda && matchDepartamento && matchPrecio;
      })
      .sort((a, b) => {
        const nombreA = (a.product_name || "").localeCompare(
          b.product_name || "",
          "es",
          { sensitivity: "base" }
        );

        return ordenProductos === "za" ? -nombreA : nombreA;
      });
  }, [
    productos,
    searchText,
    departamentoRuta,
    precioMaximoFiltro,
    precioMaximoInventario,
    ordenProductos,
  ]);

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

          <div className="client-product-filters">
            <h3>Filtros</h3>

            <label>
              Orden alfabetico
              <select
                value={ordenProductos}
                onChange={(event) => setOrdenProductos(event.target.value)}
              >
                <option value="az">A - Z</option>
                <option value="za">Z - A</option>
              </select>
            </label>

            <label>
              Rango de precio
              <span className="client-price-filter-value">
                RD$ 0 - {formatCurrency(precioMaximoFiltro)}
              </span>
              <input
                type="range"
                min="0"
                max={precioMaximoInventario}
                value={precioMaximoFiltro}
                onChange={(event) =>
                  setPrecioMaximoFiltro(Number(event.target.value))
                }
                disabled={precioMaximoInventario <= 0}
              />
            </label>
          </div>
        </aside>

        {!productosFiltrados.length ? (
          <p className="estado">No encontramos productos con esa búsqueda.</p>
        ) : (
          <div
            className={`responsive-grid client-products-grid client-products-grid-${columnas}`}
          >
            {productosFiltrados.map((producto) => {
              const favorito = isFavorite(producto.product_id);
              const stockInfo = getStockInfo(producto);

              return (
                <article
                  className="surface-card interactive-card client-product-card"
                  key={producto.product_id}
                >
                  {!stockInfo.hasStock ? (
                    <span className="client-stock-badge sold-out">Agotado</span>
                  ) : stockInfo.isLowStock ? (
                    <span className="client-stock-badge low-stock">
                      Pocas unidades
                    </span>
                  ) : null}

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
                      disabled={!stockInfo.hasStock}
                    >
                      {stockInfo.hasStock ? "Agregar al carrito" : "Agotado"}
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
