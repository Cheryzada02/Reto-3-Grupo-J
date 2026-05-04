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

import { send_email } from "../authentication/db_functions";

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

      await send_email({
        to: formData.email,
        subject: "Solicitud recibida - Ferretería Elupina",
        message: `
          <h2>Solicitud recibida</h2>
          <p>Hola ${formData.name},</p>
          <p>Recibimos tu solicitud sobre <strong>${formData.subject}</strong>. Nuestro equipo de soporte la revisará y te responderá pronto.</p>
          <p><strong>Mensaje:</strong></p>
          <p>${formData.message}</p>
        `,
        html: true,
      });

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
    <main className="page-shell customer-service-page">
      <section className="page-hero customer-service-hero">
        <span>Atención al cliente</span>

        <h1>¿Necesitas ayuda?</h1>

        <p>
          Escríbenos y nuestro equipo de Ferretería Elupina te responderá lo
          antes posible. También puedes contactarnos por teléfono o WhatsApp.
        </p>
      </section>

      <section className="customer-service-layout">
        <aside className="surface-card customer-info-panel">
          <h2>Canales de contacto</h2>

          <article className="customer-info-item">
            <Phone size={22} />
            <div>
              <h3>Teléfono</h3>
              <p>+1(809)-536-9114</p>
            </div>
          </article>

          <article className="customer-info-item">
            <MessageCircle size={22} />
            <div>
              <h3>WhatsApp</h3>
              <p>+1(809)-536-9114</p>
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
            <div className="footer-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.7342576847077!2d-69.89072652497511!3d18.495692582593076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf885c609480b3%3A0xb9a02438ccf9b799!2sFerreter%C3%ADa%20Elupina!5e0!3m2!1ses!2sdo!4v1777756257795!5m2!1ses!2sdo"
              loading="lazy"
              title="Ubicación Ferreteria Elupina"
            />
          </div>
          </article>

          <article className="customer-info-item">
            <Clock size={22} />
            <div>
              <h3>Horario</h3>
              <p>Lunes - Viernes: 8:00 AM - 6:00 PM</p>
              <p>Sábados: 8:00 AM - 4:00 PM</p>
              <p>Domingos: Cerrado</p>
            </div>
          </article>

          <div className="customer-pickup-note">
            <strong>Importante:</strong> Actualmente solo trabajamos con retiro
            en tienda. No realizamos delivery ni envíos.
          </div>
        </aside>

        <section className="surface-card customer-form-panel">
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
                  placeholder="+1(809)-536-9114"
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
