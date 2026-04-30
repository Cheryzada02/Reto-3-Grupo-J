const faqs = [
  {
    question: "¿Dónde está ubicada la ferretería?",
    answer:
      "Nuestra ferretería está ubicada en la República Dominicana. Puedes visitarnos en horario laboral o contactarnos por teléfono para más información.",
  },
  {
    question: "¿Hacen entregas a domicilio?",
    answer:
      "Sí, realizamos entregas dependiendo de la zona y la disponibilidad del producto. El costo de envío puede variar según la ubicación.",
  },
  {
    question: "¿Puedo consultar disponibilidad de productos?",
    answer:
      "Sí. En la página de productos puedes ver los artículos disponibles y su existencia actual.",
  },
  {
    question: "¿Aceptan pagos con tarjeta?",
    answer:
      "No, Solo aceptamos pagos en efectivo y transferencias, según las condiciones disponibles al momento de la compra.",
  },
  {
    question: "¿Cómo puedo contactar servicio al cliente?",
    answer:
      "Puedes contactarnos desde la sección Servicio al cliente o usando los datos de contacto que aparecen en la parte superior de la página.",
  },
  {
  question: "¿Realizan envíos o delivery?",
  answer:
    "Actualmente no contamos con servicio de envío o delivery. Todas las compras deben ser retiradas directamente en nuestra tienda (Pick Up).",
  }
];

export default function FAQ() {
  return (
    <main className="faq-page">
      <section className="faq-hero">
        <h1>Preguntas Frecuentes</h1>
        <p>
          Aquí encontrarás respuestas rápidas sobre compras, productos,
          disponibilidad y servicios.
        </p>
      </section>

      <section className="faq-list">
        {faqs.map((item, index) => (
          <article className="faq-card" key={index}>
            <h2>{item.question}</h2>
            <p>{item.answer}</p>
          </article>
        ))}
      </section>
    </main>
  );
}