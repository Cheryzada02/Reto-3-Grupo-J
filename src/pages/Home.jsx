export default function Home() {
  return (
    <section className="home">
      <div className="hero">
        <h1>Bienvenido a FerreteriaRD</h1>

        <p>
          Todo lo que necesitas para construcción, reparación y mantenimiento
          en un solo lugar.
        </p>

        <a href="/servicio-cliente" className="button">
          Contactar servicio al cliente
        </a>
      </div>

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
