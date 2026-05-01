import { NavLink, Link } from "react-router-dom";
import {
  Search,
  User,
  Mail,
  Headphones,
  LogOut,
} from "lucide-react";
import { useAuth } from  "../context/AuthContext";


import "./Navbar.css";

export default function Navbar_Admin() {

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

  const handle_log_out = () => {
    logout();
    navigate("/")
  }

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
            soporteweb@Ferreteriaelupina.com.do
          </span>
        </div>

        <Link to="/faq" className="navbar-faq">
          Preguntas Frecuentes (FAQ)
        </Link>
      </div>

      {/* MAIN BAR */}
      <div className="navbar-main">
        <Link to="/" className="navbar-logo">
          Ferreteria Elupina Admin
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

          <button onClick={handle_log_out} className={class_when_login}>
            <LogOut size={26} />
            <span>
              <strong>Salir</strong>
            </span>
          </button>

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