import { Phone, MapPin, MessageCircle, Clock, CreditCard, Wrench } from "lucide-react";

export default function Footer() {
  
  const numeroWhatsApp = "18095369114"; // IMPORTANTE: sin +
  
  const mensajeWhatsApp = encodeURIComponent(
    "Hola, estoy interesado en productos de la Ferreteria Elupina. ¿Podrían brindarme más información?"
  );

  const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`;
  const linkMaps = "https://maps.app.goo.gl/FJyUw4oqLv1D1BHH6";

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* EMPRESA */}
        <div className="footer-section">
          <h3>Ferreteria Elupina</h3>
          <p>
            Tu solución en herramientas, construcción y materiales de calidad.
          </p>

          <p className="footer-highlight">
            Atención personalizada y asesoría técnica
          </p>
        </div>

        {/* CONTACTO */}
        <div className="footer-section">
          <h4>Contacto</h4>

          <p>
            <Phone size={16} /> +1 (809) 536-9114
          </p>

          <p>
            <a 
              href={linkWhatsApp} 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          </p>

          <p>
            <a 
              href={linkMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              <MapPin size={16} /> Ver ubicación
            </a>
          </p>

          {/* MAPA */}
          <div className="footer-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.7342576847077!2d-69.89072652497511!3d18.495692582593076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf885c609480b3%3A0xb9a02438ccf9b799!2sFerreter%C3%ADa%20Elupina!5e0!3m2!1ses!2sdo!4v1777756257795!5m2!1ses!2sdo"
              loading="lazy"
              title="Ubicación Ferreteria Elupina"
            />
          </div>
        </div>

        {/* HORARIO */}
        <div className="footer-section">
          <h4>Horario</h4>

          <p><Clock size={16}/> Lunes - Viernes: 8:00 AM - 6:00 PM</p>
          <p><Clock size={16}/> Sábados: 8:00 AM - 4:00 PM</p>
          <p><Clock size={16}/> Domingos: Cerrado</p>
        </div>

        {/* SERVICIOS */}
        <div className="footer-section">
          <h4>Servicios</h4>

          <p><Wrench size={16}/> Asesoría en construcción</p>
          <p><Wrench size={16}/> Venta de herramientas</p>
          <p><Wrench size={16}/> Materiales de construcción</p>
          <p><Wrench size={16}/> Equipos industriales</p>
        </div>


      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} Ferreteria Elupina. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}