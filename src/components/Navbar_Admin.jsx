import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  Mail,
  Headphones,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar_Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(user?.role_id);

  const login = isLoggedIn ? "/perfil" : "/login";
  const user_name = isLoggedIn ? user.user_name : "Acceder";
  const class_when_login = isLoggedIn
    ? "navbar-action navbar-logout"
    : "hide";

  const handle_log_out = () => {
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
          Ferretería Elupina Admin
        </Link>

        <form className="navbar-search">
          <input type="text" placeholder="Buscar en la tienda..." />

          <button type="submit">
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

          {isLoggedIn && (
            <button
              type="button"
              onClick={handle_log_out}
              className={class_when_login}
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
          to="/departamentos"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Departamentos
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
          to="/customers"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Clientes
        </NavLink>
      </nav>
    </header>
  );
}