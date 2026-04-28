import { useState } from "react";
import { sendCustomerRequest } from "../api/customerServiceApi";

export default function CustomerService() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setStatus("Enviando...");

      await sendCustomerRequest(formData);

      setStatus("Solicitud enviada correctamente.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setStatus("No se pudo enviar la solicitud.");
      console.error(error);
    }
  }

  return (
    <section className="service-page">
      <h1>Servicio al Cliente</h1>

      <p>
        Escríbenos y nuestro equipo de FerreteriaRD te responderá lo antes
        posible.
      </p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Nombre
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Correo
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Teléfono
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Mensaje
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">Enviar solicitud</button>

        {status && <p className="status">{status}</p>}
      </form>
    </section>
  );
}
