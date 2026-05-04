import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Store,
  CreditCard,
  Hammer,
  PaintBucket,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { get_products } from "../authentication/db_functions";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1400&q=80",
    title: "Herramientas para cada proyecto",
    text: "Encuentra productos confiables para construcción, reparación y mantenimiento.",
    button: "Ver productos",
    link: "/productos",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1400&q=80",
    title: "Materiales de construcción",
    text: "Todo lo que necesitas para trabajar con seguridad y calidad.",
    button: "Explorar tienda",
    link: "/productos",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1400&q=80",
    title: "Retiro en tienda",
    text: "Compra tus productos y retíralos directamente en nuestra ferretería.",
    button: "Ver preguntas frecuentes",
    link: "/faq",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1400&q=80",
    title: "Herramientas electricas",
    text: "Equipa tu taller con productos practicos para cortar, perforar y reparar.",
    button: "Comprar ahora",
    link: "/productos",
  },
  {
    image:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1400&q=80",
    title: "Soluciones para el hogar",
    text: "Encuentra accesorios y materiales para arreglos rapidos y mejoras diarias.",
    button: "Explorar productos",
    link: "/productos",
  },
  {
    image:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1400&q=80",
    title: "Pinturas y terminaciones",
    text: "Dale nueva vida a tus espacios con pinturas, brochas y accesorios.",
    button: "Ver catalogo",
    link: "/productos",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    title: "Construccion y mantenimiento",
    text: "Materiales confiables para proyectos de obra, reparacion y remodelacion.",
    button: "Ver productos",
    link: "/productos",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80",
    title: "Asesoria para tu proyecto",
    text: "Te orientamos para elegir herramientas y materiales segun lo que necesitas.",
    button: "Contactar soporte",
    link: "/servicio-cliente",
  },
];

const categories = [
  {
    title: "Herramientas",
    text: "Taladros, martillos, llaves y equipos de trabajo.",
    icon: Hammer,
  },
  {
    title: "Pintura",
    text: "Pinturas, brochas, rodillos y accesorios.",
    icon: PaintBucket,
  },
  {
    title: "Plomería",
    text: "Tuberías, conexiones, llaves y reparaciones.",
    icon: Wrench,
  },
];

export default function Home() {
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

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

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadRecommendedProducts = async () => {
      try {
        const data = await get_products();
        const products = data
          .filter((product) => product.status === "Activo")
          .sort(
            (a, b) =>
              Number(b.current_stock || 0) - Number(a.current_stock || 0)
          )
          .slice(0, 10);

        setRecommendedProducts(products);
      } catch (error) {
        console.error("Error cargando productos recomendados:", error);
      } finally {
        setLoadingRecommended(false);
      }
    };

    loadRecommendedProducts();
  }, []);

  const slide = slides[currentSlide];

  return (
    <main className="home">
      <section className="home-slider">
        <img src={slide.image} alt={slide.title} className="slider-image" />

        <div className="slider-overlay">
          <div className="slider-content">
            <span className="slider-label">Ferretería Elupina</span>
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>

            <Link to={slide.link} className="slider-button">
              {slide.button}
            </Link>
          </div>
        </div>

        <button
          type="button"
          className="slider-control slider-control-left"
          onClick={previousSlide}
          aria-label="Imagen anterior"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          type="button"
          className="slider-control slider-control-right"
          onClick={nextSlide}
          aria-label="Imagen siguiente"
        >
          <ChevronRight size={28} />
        </button>

        <div className="slider-dots">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              className={index === currentSlide ? "dot active" : "dot"}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="home-benefits">
        <article>
          <Store size={30} />
          <div>
            <h3>Retiro en tienda</h3>
            <p>Compra online y recoge tus productos en la ferretería.</p>
          </div>
        </article>

        <article>
          <CreditCard size={30} />
          <div>
            <h3>Pago fácil</h3>
            <p>Aceptamos efectivo y transferencias bancarias.</p>
          </div>
        </article>

        <article>
          <ShieldCheck size={30} />
          <div>
            <h3>Compra segura</h3>
            <p>Productos verificados y atención personalizada.</p>
          </div>
        </article>

        <article>
          <Truck size={30} />
          <div>
            <h3>Sin delivery</h3>
            <p>Actualmente trabajamos solo con Pick Up.</p>
          </div>
        </article>
      </section>

      <section className="home-section-header">
        <span>Compra por categoría</span>
        <h2>Todo para construcción, reparación y mantenimiento</h2>
      </section>

      <section className="home-categories">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <article className="home-category-card" key={category.title}>
              <Icon size={38} />
              <h3>{category.title}</h3>
              <p>{category.text}</p>

              <Link to="/productos">Ver productos</Link>
            </article>
          );
        })}
      </section>

      <section className="home-recommended-section">
        <div className="home-recommended-header">
          <h2>Recomendados</h2>
        </div>

        {loadingRecommended ? (
          <p className="estado">Cargando productos recomendados...</p>
        ) : !recommendedProducts.length ? (
          <p className="estado">No hay productos recomendados disponibles.</p>
        ) : (
          <>
            <div className="home-recommended-grid">
              {recommendedProducts.map((product) => {
                const stockInfo = getStockInfo(product);

                return (
                  <article
                    className="home-recommended-card"
                    key={product.product_id}
                  >
                    {!stockInfo.hasStock ? (
                      <span className="home-stock-badge sold-out">Agotado</span>
                    ) : stockInfo.isLowStock ? (
                      <span className="home-stock-badge low-stock">
                        Pocas unidades
                      </span>
                    ) : null}

                    <Link
                      to={`/productos/${product.product_id}`}
                      className="home-recommended-image"
                    >
                      <img
                        src={product.image_url || "/placeholder-product.png"}
                        alt={product.product_name}
                        loading="lazy"
                      />
                    </Link>

                    <div className="home-recommended-body">
                      <span>
                        {product.supplier_name || "Ferretería Elupina"}
                      </span>

                      <Link to={`/productos/${product.product_id}`}>
                        <h3>{product.product_name}</h3>
                      </Link>

                      <p>{formatCurrency(product.sale_price)}</p>

                      <button
                        type="button"
                        className="home-recommended-button"
                        onClick={() => addToCart(product)}
                        disabled={!stockInfo.hasStock}
                      >
                        {stockInfo.hasStock ? "Añadir al carrito" : "Agotado"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <Link to="/productos" className="home-recommended-more">
              Ver más
            </Link>
          </>
        )}
      </section>

      <section className="home-cta">
        <div>
          <span>Ferretería Elupina</span>
          <h2>¿Necesitas ayuda para elegir un producto?</h2>
          <p>
            Nuestro equipo puede orientarte antes de realizar tu compra.
          </p>
        </div>

        <Link to="/servicio-cliente" className="home-cta-button">
          Contactar servicio al cliente
        </Link>
      </section>
    </main>
  );
}
