import { NavLink, Link } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Mail,
  Headphones,
} from "lucide-react";
import "./Navbar.css";


export default function Navbar_Admin() {
  return (
    <header className="navbar">
      {/* TOP BAR */}
      <div className="navbar-top">
        <div className="navbar-contact">
          <span>
            <Headphones size={16} />
            (829) 123-0000
          </span>

          <span>
            <Mail size={16} />
            soporteweb@FerreteriaRD.com.do
          </span>
        </div>

        <Link to="/faq" className="navbar-faq">
          Preguntas Frecuentes (FAQ)
        </Link>
      </div>

      {/* MAIN BAR */}
      <div className="navbar-main">
        <Link to="/" className="navbar-logo">
          FerreteriaRD
        </Link>

        <form className="navbar-search">
          <input type="text" placeholder="Buscar en la tienda..." />
          <button type="submit">
            <Search size={22} />
          </button>
        </form>

        <div className="navbar-actions">
          <Link to="/login" className="navbar-action">
            <User size={28} />
            <span>
              Hola <strong>Acceder</strong>
            </span>
          </Link>

          <Link to="/favoritos" className="navbar-action">
            <Heart size={26} />
            <span>
              Lista de <strong>favoritos</strong>
            </span>
          </Link>

          <Link to="/carrito" className="navbar-action cart">
            <ShoppingCart size={26} />
            <span className="cart-count">0</span>
            <span>
              <strong>Carrito</strong>
            </span>
          </Link>
        </div>
      </div>

      {/* MENU */}
      <nav className="navbar-menu">
        <div className="menu-department">
          <strong>Departamentos</strong>
          <span>Ver todos</span>
        </div>

        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/ofertas"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Ofertas
        </NavLink>

        <NavLink
          to="/marcas"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Marcas
        </NavLink>

        <NavLink
          to="/servicio-cliente"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Servicio al cliente
        </NavLink>

        <NavLink
          to="/productos"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Productos
        </NavLink>

        <NavLink
          to="/suplidores"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Suplidores
        </NavLink>

        <NavLink
          to="/inventory_movements"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Movimientos Inventario
        </NavLink>

      </nav>
    </header>
  );
}