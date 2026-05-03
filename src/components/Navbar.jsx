import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  User,
  Heart,
  ShoppingCart,
  Mail,
  Headphones,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { get_departments } from "../authentication/db_functions";
import ProductSearch from "./ProductSearch";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [departamentos, set_departamentos] = useState([]);

  const [showDepartments, setShowDepartments] = useState(false);

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
    navigate("/productos");
    closeDepartments();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const load_departments = async () => {
    try {
      const data = await get_departments();
      set_departamentos(data);
      
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    load_departments();
  }, []); 

  const crearRutaDepartamento = (texto) => {
    return texto
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
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
          Ferreteria Elupina
        </Link>

        <ProductSearch />

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
                  key={departamento.department_id}
                  to={`/departamentos/${crearRutaDepartamento(departamento.department_name)}`}
                  onClick={closeDepartments}
                >
                  {departamento.department_name}
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
