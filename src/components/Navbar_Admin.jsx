import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Bell,
  User,
  Mail,
  Headphones,
  LogOut,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ProductSearch from "./ProductSearch";


export default function Navbar_Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNotificationsOpen, set_is_notifications_open] = useState(false);

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
            +1(809)-536-9114
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

        <ProductSearch />

        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-action notification-button"
            onClick={() => set_is_notifications_open(true)}
            aria-label="Abrir notificaciones"
          >
            <Bell size={24} />
            <span>
              <strong>Notificaciones</strong>
            </span>
          </button>

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

        <NavLink
          to="/orders"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Ordenes
        </NavLink>

        <NavLink
          to="/orders_details"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Detalle Ordenes
        </NavLink>

      </nav>

      <div
        className={
          isNotificationsOpen
            ? "notification-overlay open"
            : "notification-overlay"
        }
        onClick={() => set_is_notifications_open(false)}
        aria-hidden={!isNotificationsOpen}
      />

      <aside
        className={
          isNotificationsOpen
            ? "notification-panel open"
            : "notification-panel"
        }
        aria-label="Panel de notificaciones"
        aria-hidden={!isNotificationsOpen}
      >
          <div className="notification-panel-header">
            <div>
              <span>Panel</span>
              <h2>Notificaciones</h2>
            </div>

            <button
              type="button"
              onClick={() => set_is_notifications_open(false)}
              aria-label="Cerrar notificaciones"
            >
              <X size={20} />
            </button>
          </div>

          <div className="notification-panel-body">
            <p>Las notificaciones aparecerán aquí.</p>
          </div>
      </aside>
    </header>
  );
}
