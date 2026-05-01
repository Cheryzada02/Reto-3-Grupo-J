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
  LogOut,
} from "lucide-react";

import { departamentos } from "../data/departamentos";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [showDepartments, setShowDepartments] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { cartCount } = useCart();

  const isLoggedIn = Boolean(user?.role_id);

  const profileLink = isLoggedIn ? "/perfil" : "/login";
  const userName = isLoggedIn ? user.user_name : "Acceder";

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

  const handleSearch = (e) => {
    e.preventDefault();

    const cleanSearch = searchTerm.trim();

    if (!cleanSearch) {
      navigate("/productos");
      return;
    }

    navigate(`/productos?buscar=${encodeURIComponent(cleanSearch)}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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
            soporteweb@ferreteriaelupina.com.do
          </span>
        </div>

        <Link to="/faq" className="navbar-faq">
          Preguntas Frecuentes (FAQ)
        </Link>
      </div>

      <div className="navbar-main">
        <Link to="/" className="navbar-logo">
          Ferreteria Elupina
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar en la tienda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button type="submit" aria-label="Buscar productos">
            <Search size={22} />
          </button>
        </form>

        <div className="navbar-actions">
          <Link to={profileLink} className="navbar-action">
            <User size={28} />
            <span>
              Hola <strong>{userName}</strong>
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
            <span className="cart-count">{cartCount}</span>
            <span>
              <strong>Carrito</strong>
            </span>
          </Link>

          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="navbar-action navbar-logout"
            >
              <LogOut size={26} />
              <span>
                <strong>Salir</strong>
              </span>
            </button>
          )}
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
          to="/servicio-cliente"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Soporte
        </NavLink>

        <NavLink
          to="/productos"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Productos
        </NavLink>

        <NavLink
          to="/perfil"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Perfil
        </NavLink>
      </nav>
    </header>
  );
}