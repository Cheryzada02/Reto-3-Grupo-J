import { useEffect, useState } from "react";
import { get_products } from "../authentication/db_functions";
import "./Articulos.css";

export default function Articulos() {
  const [articulos, setArticulos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarArticulos();
  }, []);

  const cargarArticulos = async () => {
    try {
      const data = await get_products();
      setArticulos(data);
    } catch (err) {
      console.error("Error cargando productos:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando artículos...</p>;

  return (
    <main className="articulos-page">
      <h1>Artículos disponibles</h1>

      <div className="articulos-grid">
        {articulos.map((item) => (
          <div key={item.product_id} className="articulo-card">
            <img
              src={item.image_url}
              alt={item.product_name}
              className="articulo-img"
            />

            <h2>{item.product_name}</h2>

            <p>{item.description}</p>

            <div className="articulo-footer">
              <span className="precio">
                RD$ {Number(item.sale_price).toFixed(2)}
              </span>

              <span className="stock">
                Stock: {item.current_stock}
              </span>
            </div>

            <button className="btn-agregar">
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}