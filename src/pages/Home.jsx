import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1400&q=80",
    title: "Herramientas para cada proyecto",
    text: "Encuentra productos confiables para construcción, reparación y mantenimiento.",
    button: "Ver productos",
    link: "/productos",
  },
  {
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1400&q=80",
    title: "Materiales de construcción",
    text: "Todo lo que necesitas para trabajar con seguridad y calidad.",
    button: "Conocer más",
    link: "/servicio-cliente",
  },
  {
    image:
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1400&q=80",
    title: "Retiro en tienda",
    text: "Compra tus productos y retíralos directamente en nuestra ferretería.",
    button: "Preguntas frecuentes",
    link: "/faq",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const slide = slides[currentSlide];

  return (
    <section className="home">
      <section className="home-slider">
        <img src={slide.image} alt={slide.title} className="slider-image" />

        <div className="slider-overlay">
          <div className="slider-content">
            <span className="slider-label">Ferreteria Elupina</span>

            <h1>{slide.title}</h1>

            <p>{slide.text}</p>

            <a href={slide.link} className="slider-button">
              {slide.button}
            </a>
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

      <section className="cards">
        <article className="card">
          <h2>Herramientas</h2>
          <p>Taladros, martillos, sierras, llaves y más.</p>
        </article>

        <article className="card">
          <h2>Construcción</h2>
          <p>Cemento, pintura, tuberías, electricidad y materiales.</p>
        </article>

        <article className="card">
          <h2>Asesoría</h2>
          <p>Te ayudamos a elegir el producto correcto.</p>
        </article>
      </section>
    </section>
  );
}