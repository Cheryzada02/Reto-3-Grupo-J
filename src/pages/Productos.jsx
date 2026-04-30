function ProductosPagina() {
  return (
    <>
     

      <section className="productos">
        <h2>Productos Destacados</h2>

        <div className="contenedor">

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80"
              alt="Taladro"
            />

            <div className="card-body">
              <h3>Taladro Eléctrico</h3>
              <p>Potente taladro para trabajos profesionales.</p>

              <div className="precio">RD$ 3,500</div>

              <a href="#" className="btn">Comprar</a>
            </div>
          </div>

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800"
              alt="Caja de herramientas"
            />

            <div className="card-body">
              <h3>Caja de Herramientas</h3>
              <p>Ideal para guardar todas tus herramientas.</p>

              <div className="precio">RD$ 2,200</div>

              <a href="#" className="btn">Comprar</a>
            </div>
          </div>

          <div className="card">
            <img
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800"
              alt="Martillo"
            />

            <div className="card-body">
              <h3>Martillo Profesional</h3>
              <p>Resistente y cómodo para todo tipo de trabajo.</p>

              <div className="precio">RD$ 850</div>

              <a href="#" className="btn">Comprar</a>
            </div>
          </div>

          <div className="card">
            <img
              src="https://images.pexels.com/photos/5691613/pexels-photo-5691613.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Pintura"
            />

            <div className="card-body">
              <h3>Pintura Blanca</h3>
              <p>Pintura de alta calidad para interiores y exteriores.</p>

              <div className="precio">RD$ 1,500</div>

              <a href="#" className="btn">Comprar</a>
            </div>
          </div>

          <div className="card">
            <img
              src="https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Escalera"
            />

            <div className="card-body">
              <h3>Escalera de Aluminio</h3>
              <p>Resistente y segura para trabajos en altura.</p>

              <div className="precio">RD$ 4,800</div>

              <a href="#" className="btn">Comprar</a>
            </div>
          </div>

          <div className="card">
            <img
              src="https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Llave inglesa"
            />

            <div className="card-body">
              <h3>Llave Inglesa</h3>
              <p>Herramienta ajustable ideal para reparaciones.</p>

              <div className="precio">RD$ 950</div>

              <a href="#" className="btn">Comprar</a>
            </div>
          </div>

        </div>
      </section>

      <footer>
        <p>&copy; 2026 Ferretería RD - Todos los derechos reservados</p>
      </footer>
    </>
  );
}

export default ProductosPagina;