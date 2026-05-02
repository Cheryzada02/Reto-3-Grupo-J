import { HelpCircle } from "lucide-react";

const faqItems = [
  {
    id: 1,
    question: "¿Dónde está ubicada la ferretería?",
    answer:
      "Estamos ubicados en C/ Domingo Savio #50, Distrito Nacional, República Dominicana.",
  },
  {
    id: 2,
    question: "¿Hacen entregas a domicilio?",
    answer:
      "Actualmente no realizamos envíos ni delivery. Todas las compras deben ser retiradas directamente en nuestra tienda mediante Pick Up.",
  },
  {
    id: 3,
    question: "¿Puedo consultar disponibilidad de productos?",
    answer:
      "Sí. Puedes consultar la disponibilidad de los productos desde la página de productos o contactarnos por WhatsApp.",
  },
  {
    id: 4,
    question: "¿Aceptan pagos con tarjeta?",
    answer:
      "No. Actualmente solo aceptamos pagos en efectivo y transferencias bancarias.",
  },
  {
    id: 5,
    question: "¿Cómo puedo contactar servicio al cliente?",
    answer:
      "Puedes contactarnos por teléfono, WhatsApp o desde los datos de contacto disponibles en la página.",
  },
  {
    id: 6,
    question: "¿Realizan envíos o delivery?",
    answer:
      "No contamos con servicio de envío o delivery. Las compras deben ser retiradas directamente en Ferreteria Elupina.",
  },
];

function FAQCard({ faq }) {
  return (
    <article className="faq-card">
      <div className="faq-card-icon">
        <HelpCircle size={24} />
      </div>

      <div className="faq-card-content">
        <h2>{faq.question}</h2>
        <p>{faq.answer}</p>
      </div>
    </article>
  );
}

function FAQGrid({ items }) {
  return (
    <section className="faq-grid">
      {items.map((faq) => (
        <FAQCard key={faq.id} faq={faq} />
      ))}
    </section>
  );
}

export default function FAQ() {
  return (
    <main className="faq-page">
      <section className="faq-header">
        <span>Ayuda</span>
        <h1>Preguntas Frecuentes</h1>
        <p>
          Encuentra respuestas rápidas sobre compras, productos, disponibilidad,
          pagos y servicios de Ferreteria Elupina.
        </p>
      </section>

      <FAQGrid items={faqItems} />
    </main>
  );
}