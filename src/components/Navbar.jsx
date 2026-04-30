import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Mail,
  Headphones,
  ChevronDown,
} from "lucide-react";

import { departamentos } from "../data/departamentos";
import "./Navbar.css";

export default function Navbar() {
  const [showDepartments, setShowDepartments] = useState(false);
  const navigate = useNavigate();

  const toggleDepartments = () => {
    setShowDepartments((prev) => !prev);
  };

  const closeDepartments = () => {
    setShowDepartments(false);
  };

  const handleViewAllProducts = (e) => {
    e.stopPropagation();
    setShowDepartments(false);
    navigate("/productos");
  };

  return (
    <header className="navbar">
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

      <nav className="navbar-menu">
        <div className="department-wrapper">
          <button
            type="button"
            className="menu-department"
            onClick={toggleDepartments}
          >
            <strong>Departamentos</strong>

            <span onClick={handleViewAllProducts}>
              Ver todos
              <ChevronDown size={16} />
            </span>
          </button>

          {showDepartments && (
            <div className="department-dropdown">
              {departamentos.map((departamento) => (
                <Link
                  key={departamento.id}
                  to={departamento.ruta}
                  onClick={closeDepartments}
                >
                  {departamento.nombre}
                </Link>
              ))}
            </div>
          )}
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
      </nav>
    </header>
  );
}