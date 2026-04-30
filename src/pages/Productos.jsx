import { useCart } from "../context/CartContext";

const productos = [
  {
    product_id: 1,
    product_name: "Taladro Eléctrico",
    description: "Potente taladro para trabajos profesionales.",
    sale_price: 3500,
    image_url:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
  },
  {
    product_id: 2,
    product_name: "Caja de Herramientas",
    description: "Ideal para guardar todas tus herramientas.",
    sale_price: 2200,
    image_url:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800",
  },
  {
    product_id: 3,
    product_name: "Martillo Profesional",
    description: "Resistente y cómodo para todo tipo de trabajo.",
    sale_price: 850,
    image_url:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
  },
  {
    product_id: 4,
    product_name: "Pintura Blanca",
    description: "Pintura de alta calidad para interiores y exteriores.",
    sale_price: 1500,
    image_url:
      "https://images.pexels.com/photos/5691613/pexels-photo-5691613.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    product_id: 5,
    product_name: "Escalera de Aluminio",
    description: "Resistente y segura para trabajos en altura.",
    sale_price: 4800,
    image_url:
      "https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    product_id: 6,
    product_name: "Llave Inglesa",
    description: "Herramienta ajustable ideal para reparaciones.",
    sale_price: 950,
    image_url:
      "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

function ProductosPagina() {
  const { addToCart } = useCart();

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
        {productos.map((producto) => (
          <div className="card" key={producto.product_id}>
            <img src={producto.image_url} alt={producto.product_name} />

            <div className="card-body">
              <h3>{producto.product_name}</h3>
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
        ))}
      </div>
    </section>
  );
}

export default ProductosPagina;