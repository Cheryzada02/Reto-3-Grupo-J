import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";

export const productos = [
  {
    product_id: 1,
    product_name: "Taladro Eléctrico",
    description: "Potente taladro para trabajos profesionales.",
    sale_price: 3500,
    old_price: 4200,
    brand: "Truper",
    sku: "TAL-001",
    stock: 12,
    image_url:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: 2,
    product_name: "Caja de Herramientas",
    description: "Ideal para guardar todas tus herramientas.",
    sale_price: 2200,
    old_price: 2700,
    brand: "Stanley",
    sku: "CAJ-002",
    stock: 8,
    image_url:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800",
  },
  {
    product_id: 3,
    product_name: "Martillo Profesional",
    description: "Resistente y cómodo para todo tipo de trabajo.",
    sale_price: 850,
    old_price: 1100,
    brand: "Pretul",
    sku: "MAR-003",
    stock: 20,
    image_url:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
  },
];

function ProductosPagina() {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(value);
  };

  return (
    <section className="productos">
      <h2>Productos Destacados</h2>

      <div className="contenedor">
        {productos.map((producto) => {
          const favorito = isFavorite(producto.product_id);

          return (
            <div className="card" key={producto.product_id}>
              <button
                type="button"
                className={favorito ? "favorite-button active" : "favorite-button"}
                onClick={() => toggleFavorite(producto)}
              >
                <Heart size={18} />
              </button>

              <Link to={`/productos/${producto.product_id}`}>
                <img src={producto.image_url} alt={producto.product_name} />
              </Link>

              <div className="card-body">
                <Link to={`/productos/${producto.product_id}`}>
                  <h3>{producto.product_name}</h3>
                </Link>

                <p>{producto.description}</p>

                <div className="precio">
                  {formatCurrency(producto.sale_price)}
                </div>

                <button
                  type="button"
                  className="btn"
                  onClick={() => addToCart(producto)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ProductosPagina;