import { Phone, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* EMPRESA */}
        <div className="footer-section">
          <h3>Ferreteria Elupina</h3>
          <p>
            Tu solución en herramientas, construcción y materiales de calidad.
          </p>
        </div>

        {/* CONTACTO */}
        <div className="footer-section">
          <h4>Contacto</h4>

          <p>
            <Phone size={16} /> (829) 123-0000
          </p>

          <p>
            <MessageCircle size={16} /> WhatsApp: (829) 123-0000
          </p>

          <p>
            <MapPin size={16} /> C/ Domingo Savio #50, Distrito Nacional, República Dominicana
          </p>
        </div>

        {/* INFO */}
        <div className="footer-section">
          <h4>Información</h4>

          <p>Retiro en tienda (Pick Up)</p>
          <p>No realizamos envíos ni delivery</p>
          <p>Solo aceptamos Efectivo y Transferencias</p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Ferreteria Elupina. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}