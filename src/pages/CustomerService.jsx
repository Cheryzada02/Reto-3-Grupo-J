import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  HelpCircle,
  Send,
} from "lucide-react";

import { sendCustomerRequest } from "../api/customerServiceApi";

export default function CustomerService() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    message: "",
  });

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
    if (!formData.subject.trim()) return "El asunto es obligatorio.";
    if (!formData.message.trim()) return "El mensaje es obligatorio.";
    if (formData.message.trim().length < 10) {
      return "El mensaje debe tener al menos 10 caracteres.";
    }

    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setStatus({
        type: "error",
        message: validationError,
      });
      return;
    }

    try {
      setLoading(true);

      setStatus({
        type: "info",
        message: "Enviando solicitud...",
      });

      await sendCustomerRequest(formData);

      setStatus({
        type: "success",
        message: "Solicitud enviada correctamente. Te responderemos pronto.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "Error al enviar la solicitud. Intenta nuevamente.",
      });

      console.error("CustomerService error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="customer-service-page">
      <section className="customer-service-hero">
        <span className="customer-service-label">Atención al cliente</span>

        <h1>¿Necesitas ayuda?</h1>

        <p>
          Escríbenos y nuestro equipo de Ferretería Elupina te responderá lo
          antes posible. También puedes contactarnos por teléfono o WhatsApp.
        </p>
      </section>

      <section className="customer-service-layout">
        <aside className="customer-info-panel">
          <h2>Canales de contacto</h2>

          <article className="customer-info-item">
            <Phone size={22} />
            <div>
              <h3>Teléfono</h3>
              <p>(829) 123-0000</p>
            </div>
          </article>

          <article className="customer-info-item">
            <MessageCircle size={22} />
            <div>
              <h3>WhatsApp</h3>
              <p>(829) 123-0000</p>
            </div>
          </article>

          <article className="customer-info-item">
            <Mail size={22} />
            <div>
              <h3>Correo</h3>
              <p>soporteweb@ferreteriaelupina.com.do</p>
            </div>
          </article>

          <article className="customer-info-item">
            <MapPin size={22} />
            <div>
              <h3>Ubicación</h3>
              <p>Santo Domingo, República Dominicana</p>
            </div>
          </article>

          <article className="customer-info-item">
            <Clock size={22} />
            <div>
              <h3>Horario</h3>
              <p>Lunes a sábado, horario laboral</p>
            </div>
          </article>

          <div className="customer-pickup-note">
            <strong>Importante:</strong> Actualmente solo trabajamos con retiro
            en tienda. No realizamos delivery ni envíos.
          </div>
        </aside>

        <section className="customer-form-panel">
          <div className="customer-form-header">
            <HelpCircle size={28} />
            <div>
              <h2>Enviar una solicitud</h2>
              <p>
                Completa el formulario y describe tu consulta con el mayor
                detalle posible.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="customer-form">
            <div className="customer-form-grid">
              <label>
                Nombre
                <input
                  type="text"
                  name="name"
                  placeholder="Tu nombre"
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
                  placeholder="tu-correo@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="customer-form-grid">
              <label>
                Teléfono
                <input
                  type="tel"
                  name="phone"
                  placeholder="(829) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </label>

              <label>
                Asunto
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona un asunto</option>
                  <option value="Disponibilidad de producto">
                    Disponibilidad de producto
                  </option>
                  <option value="Ayuda con una compra">
                    Ayuda con una compra
                  </option>
                  <option value="Retiro en tienda">Retiro en tienda</option>
                  <option value="Pago por transferencia">
                    Pago por transferencia
                  </option>
                  <option value="Otra consulta">Otra consulta</option>
                </select>
              </label>
            </div>

            <label>
              Mensaje
              <textarea
                name="message"
                placeholder="Escribe tu solicitud aquí..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="customer-submit" disabled={loading}>
              <Send size={18} />
              {loading ? "Enviando..." : "Enviar solicitud"}
            </button>

            {status.message && (
              <p className={`customer-status ${status.type}`}>
                {status.message}
              </p>
            )}
          </form>
        </section>
      </section>
    </main>
  );
}