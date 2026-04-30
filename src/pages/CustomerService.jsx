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
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validateForm() {
    if (!formData.name.trim()) return "El nombre es obligatorio.";
    if (!formData.email.includes("@")) return "Correo inválido.";
    if (!formData.message.trim()) return "El mensaje es obligatorio.";

    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setStatus(validationError);
      return;
    }

    try {
      setLoading(true);
      setStatus("Enviando solicitud...");

      await sendCustomerRequest(formData);

      setStatus("Solicitud enviada correctamente.");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      setStatus("Error al enviar la solicitud. Intenta nuevamente.");
      console.error("CustomerService error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="service-page">
      <h1>Servicio al Cliente</h1>

      <p>
        Escríbenos y nuestro equipo de Ferretería Elupina te responderá lo antes
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

        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>

        {status && <p className="status">{status}</p>}
      </form>
    </section>
  );
}