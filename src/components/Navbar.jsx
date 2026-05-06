import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  User,
  Heart,
  ShoppingCart,
  Mail,
  Headphones,
  ChevronDown,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { get_customer_info, get_departments } from "../authentication/db_functions";
import ProductSearch from "./ProductSearch";

const CLOSE_CHATBOT_EVENT = "elupina-close-chatbot";
const CLOSE_ACCESSIBILITY_EVENT = "elupina-close-accessibility";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [departamentos, set_departamentos] = useState([]);
  const [showDepartments, setShowDepartments] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const closeFloatingWidgets = () => {
    window.dispatchEvent(new Event(CLOSE_CHATBOT_EVENT));
    window.dispatchEvent(new Event(CLOSE_ACCESSIBILITY_EVENT));
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    closeDepartments();
  };

  const closeAllOverlays = () => {
    closeMobileMenu();
    closeFloatingWidgets();
  };

  const handleViewAllProducts = (e) => {
    e.stopPropagation();
    navigate("/productos");
    closeAllOverlays();
  };

  const handleLogout = () => {
    logout();
    closeAllOverlays();
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

  useEffect(() => {
    document.documentElement.classList.toggle(
      "mobile-menu-open",
      isMobileMenuOpen
    );

    if (isMobileMenuOpen) closeFloatingWidgets();

    return () => {
      document.documentElement.classList.remove("mobile-menu-open");
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!user?.user_id) {
      setProfileImage("");
      return;
    }

    const loadProfileImage = async () => {
      try {
        const data = await get_customer_info(user.user_id);
        const customerData = Array.isArray(data) ? data[0] : data;
        setProfileImage(customerData?.image_url || "");
      } catch (error) {
        console.error("Error cargando foto de perfil:", error);
      }
    };

    loadProfileImage();
  }, [user?.user_id]);

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
    <header className={isMobileMenuOpen ? "navbar navbar-mobile-open" : "navbar"}>
      <div className="navbar-top">
        <div className="navbar-contact">
          <span>
            <Headphones size={16} />
            +1(809)-536-9114
          </span>

          <Link to="/servicio-cliente" onClick={closeAllOverlays}>
            <Mail size={16} />
            ferreteriaelupina@gmail.com
          </Link>
        </div>

        <Link to="/faq" className="navbar-faq">
          Preguntas Frecuentes (FAQ)
        </Link>
      </div>

      <div className="navbar-main">
        <Link to="/" className="navbar-logo" onClick={closeAllOverlays}>
          <img src="/logo-elupina.svg" alt="Ferreteria Elupina" />
        </Link>

        <button
          type="button"
          className="navbar-mobile-toggle"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
          aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isLoggedIn && (
          <button
            type="button"
            className="navbar-mobile-logout"
            onClick={handleLogout}
            aria-label="Cerrar sesion"
          >
            <LogOut size={23} />
          </button>
        )}

        <ProductSearch />

        <div className="navbar-actions">
          <Link to={profileLink} className="navbar-action" onClick={closeAllOverlays}>
            {isLoggedIn && profileImage ? (
              <img
                src={profileImage}
                alt="Foto de perfil"
                className="navbar-profile-avatar"
              />
            ) : (
              <User size={28} />
            )}
            <span>
              Hola <strong>{userName}</strong>
            </span>
          </Link>

          <Link to="/favoritos" className="navbar-action" onClick={closeAllOverlays}>
            <Heart size={26} />
            <span>
              Lista de <strong>favoritos</strong>
            </span>
          </Link>

          <Link to="/carrito" className="navbar-action cart" onClick={closeAllOverlays}>
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
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={closeAllOverlays}
        >
          Inicio
        </NavLink>

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
              <Link
                to="/productos"
                className="navbar-department-all"
                onClick={closeAllOverlays}
              >
                Ver todos
              </Link>

              {departamentos.map((departamento) => (
                <Link
                  key={departamento.department_id}
                  to={`/departamentos/${crearRutaDepartamento(departamento.department_name)}`}
                  onClick={closeAllOverlays}
                >
                  {departamento.department_name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <NavLink
          to="/productos"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={closeAllOverlays}
        >
          Productos
        </NavLink>

        <NavLink
          to="/servicio-cliente"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={closeAllOverlays}
        >
          Soporte
        </NavLink>

        <NavLink
          to="/sobre-nosotros"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={closeAllOverlays}
        >
          Sobre nosotros
        </NavLink>

        <NavLink
          to="/perfil"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={closeAllOverlays}
        >
          Perfil
        </NavLink>

        <NavLink
          to="/faq"
          className={({ isActive }) =>
            isActive ? "navbar-mobile-only active" : "navbar-mobile-only"
          }
          onClick={closeAllOverlays}
        >
          Preguntas frecuentes
        </NavLink>

      </nav>
    </header>
  );
}
