import { NavLink, Link } from "react-router-dom";
import {
  Search,
  User,
  Mail,
  Headphones,
  LogOut,
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
          FerreteriaRD Admin
        </Link>

        <form className="navbar-search">
          <input type="text" placeholder="Buscar productos..." />
          <button type="submit">
            <Search size={22} />
          </button>
        </form>

        <div className="navbar-actions">
          <div className="navbar-action">
            <User size={28} />
            <span>
              Panel <strong>Administrador</strong>
            </span>
          </div>

          <Link to="/login" className="navbar-action">
            <LogOut size={26} />
            <span>
              <strong>Salir</strong>
            </span>
          </Link>
        </div>
      </div>

      {/* MENU ADMIN */}
      <nav className="navbar-menu">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Dashboard
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
          Inventario
        </NavLink>

        <NavLink
          to="/servicio-cliente"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Soporte
        </NavLink>
      </nav>
    </header>
  );
}