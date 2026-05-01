import { useState, useEffect } from "react";
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
import { useAuth } from  "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {

  const { user, logout } = useAuth();
  
  let login;
  let user_name;
  let class_when_login;

  if (user?.role_id) {
    login = "/";
    user_name = user.user_name;
    class_when_login = "navbar-action";
  } else {
    login = "/login";
    user_name = "Acceder";
    class_when_login = "hide";
  }

  const [showDepartments, setShowDepartments] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { cartCount } = useCart();

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

  const handle_log_out = () => {
    logout();
    navigate("/")
  }

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
          <Link to={login} className="navbar-action">
            <User size={28} />
            <span>
              Hola <strong>{user_name}</strong>
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

          <button onClick={handle_log_out} className={class_when_login}>
            <LogOut size={26} />
            <span>
              <strong>Salir</strong>
            </span>
          </button>

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
          Soporte
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