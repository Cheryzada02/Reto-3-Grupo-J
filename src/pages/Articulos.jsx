import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { get_products } from "../authentication/db_functions";
import "./Articulos.css";

export default function Articulos() {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busqueda, setBusqueda] = useState("");
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      const data = await get_products();
      setArticulos(data || []);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  };

  const normalizarTextoArticulo = (texto) => {
    return String(texto || "").toLowerCase().trim();
  };

  const productosFiltrados = useMemo(() => {
    const texto = normalizarTextoArticulo(busqueda);

    if (!texto) return articulos;

    return articulos.filter((item) => {
      const nombre = normalizarTextoArticulo(item.product_name);
      const descripcion = normalizarTextoArticulo(item.description);

      return nombre.includes(texto) || descripcion.includes(texto);
    });
  }, [busqueda, articulos]);

  const productosRelacionados = useMemo(() => {
    const texto = normalizarTextoArticulo(busqueda);

    if (!texto) return [];

    return productosFiltrados.slice(0, 6);
  }, [busqueda, productosFiltrados]);

  const seleccionarProductoRelacionado = (producto) => {
    setBusqueda(producto.product_name || "");
    setMostrarDropdown(false);
  };

  const limpiarBusquedaArticulo = () => {
    setBusqueda("");
    setMostrarDropdown(false);
  };

  if (loading) return <p className="page-loading">Cargando artículos...</p>;

  return (
    <main className="articulos-page">
      <h1>Artículos disponibles</h1>

      <div className="articulos-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setMostrarDropdown(true);
          }}
          onFocus={() => setMostrarDropdown(true)}
          onBlur={() => {
            setTimeout(() => setMostrarDropdown(false), 150);
          }}
        />

        {busqueda && (
          <button
            type="button"
            className="articulos-search-clear"
            onClick={limpiarBusquedaArticulo}
            aria-label="Limpiar búsqueda"
          >
            <X size={16} />
          </button>
        )}

        {mostrarDropdown && productosRelacionados.length > 0 && (
          <div className="articulos-search-dropdown">
            {productosRelacionados.map((producto) => (
              <button
                type="button"
                key={producto.product_id}
                className="articulos-search-option"
                onClick={() => seleccionarProductoRelacionado(producto)}
              >
                <img
                  src={producto.image_url || "/placeholder-product.png"}
                  alt={producto.product_name}
                />

                <span>
                  <strong>{producto.product_name}</strong>
                  <small>
                    RD$ {Number(producto.sale_price || 0).toFixed(2)}
                  </small>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {productosFiltrados.length === 0 ? (
        <section className="articulos-empty">
          <h2>No se encontraron productos</h2>
          <p>Intenta buscar con otro nombre o palabra relacionada.</p>
        </section>
      ) : (
        <div className="articulos-grid">
          {productosFiltrados.map((item) => (
            <div key={item.product_id} className="articulo-card">
              <img
                src={item.image_url || "/placeholder-product.png"}
                alt={item.product_name}
                className="articulo-img"
              />

              <h2>{item.product_name}</h2>

              <p>{item.description}</p>

              <div className="articulo-footer">
                <span className="precio">
                  RD$ {Number(item.sale_price || 0).toFixed(2)}
                </span>

                <span className="stock">
                  Stock: {item.current_stock}
                </span>
              </div>

              <button type="button" className="btn-agregar">
                Agregar al carrito
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
