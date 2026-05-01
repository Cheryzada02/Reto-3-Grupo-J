import { useEffect, useState } from "react";
import { get_products } from "../authentication/db_functions";

function ProductosPagina() {

  const [productos, setProductos] = useState([]);

  useEffect(() => {

    async function cargarProductos() {

      const data = await get_products();

      setProductos(data);

    }

    cargarProductos();

  }, []);

  return (
    <>
      <section className="productos">

        <h2>Productos Destacados</h2>

        <div className="contenedor">

          {productos.map((producto) => (

            <div className="card" key={producto.product_id}>

              <img
                src={producto.image_url}
                alt={producto.product_name}
              />

              <div className="card-body">

                <h3>{producto.product_name}</h3>

                <p>{producto.description}</p>

                <div className="precio">
                  RD$ {producto.sale_price}
                </div>

                <p>
                  Stock disponible: {producto.current_stock}
                </p>

                <a href="#" className="btn">
                  Comprar
                </a>

              </div>

            </div>

          ))}

        </div>

      </section>
    </>
  );
}

export default ProductosPagina;