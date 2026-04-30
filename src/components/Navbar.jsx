import { Link } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Mail,
  Headphones,
} from "lucide-react";
import "./Navbar.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-contact">
          <span>
            <Headphones size={18} />
            (829) 123-0000
          </span>

          <span>
            <Mail size={18} />
            soporteweb@FerreteriaRD.com.do
          </span>
        </div>

        <Link to="/faq" className="navbar-faq">
          Preguntas Frecuentes (FAQ)
        </Link>
      </div>

      <div className="navbar-main">
        <Link to="/" className="navbar-logo">
          FerreteriaRD
        </Link>

        <form className="navbar-search">
          <input type="text" placeholder="Buscar en la tienda..." />
          <button type="submit">
            <Search size={24} />
          </button>
        </form>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-action">
            <User size={32} />
            <span>
              Hola <strong>Acceder</strong>
            </span>
          </Link>

          <Link to="/favoritos" className="navbar-action">
            <Heart size={28} />
            <span>
              Lista de <strong>favoritos</strong>
            </span>
          </Link>

          <Link to="/carrito" className="navbar-action cart">
            <ShoppingCart size={28} />
            <span className="cart-count">0</span>
            <span>
              <strong>Carrito</strong>
            </span>
          </Link>
        </div>
      </div>

      <nav className="navbar-menu">
        <div className="departments">
          <strong>Departamentos</strong>
          <span>Ver todos</span>
        </div>

        <Link to="/">Inicio</Link>
        <Link to="/ofertas">Ofertas</Link>
        <Link to="/marcas">Marcas</Link>
        <Link to="/servicio-cliente">Servicio al cliente</Link>
        <Link to="/productos">Productos</Link>
      </nav>
    </header>
  );
}