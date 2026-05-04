import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  Bell,
  User,
  Mail,
  Headphones,
  LogOut,
  X,
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import ProductSearch from "./ProductSearch";
import { get_products, get_stock_alerts } from "../authentication/db_functions";

const STOCK_ALERTS_UPDATED_EVENT = "stock-alerts-updated";

function getThresholdValue(alert) {
  return Number(alert.thershold_value ?? alert.threshold_value ?? Number.POSITIVE_INFINITY);
}

function isStockAlertResolved(alert) {
  if (typeof alert.computed_resolved === "boolean") {
    return alert.computed_resolved;
  }

  const value = alert.is_resolved;

  if (typeof value === "string") {
    return value.trim().toUpperCase() === "YES";
  }

  return Boolean(value);
}

export default function Navbar_Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNotificationsOpen, set_is_notifications_open] = useState(false);
  const [stockAlerts, set_stock_alerts] = useState([]);
  const [isStockPromptOpen, set_is_stock_prompt_open] = useState(false);

  const isLoggedIn = Boolean(user?.role_id);
  const unresolvedStockAlerts = stockAlerts.filter(
    (alert) => !isStockAlertResolved(alert)
  );

  const login = isLoggedIn ? "/perfil" : "/login";
  const user_name = isLoggedIn ? user.user_name : "Acceder";
  const class_when_login = isLoggedIn
    ? "navbar-action navbar-logout"
    : "hide";

  const handle_log_out = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (user?.role_id !== 1) return;

    let isMounted = true;

    const loadStockAlerts = async ({ showLoginPrompt = false } = {}) => {
      try {
        const [alertsData, productsData] = await Promise.all([
          get_stock_alerts(),
          get_products(),
        ]);

        if (!isMounted) return;

        const productsById = new Map(
          (productsData || []).map((product) => [
            Number(product.product_id),
            product,
          ])
        );

        const alerts = (alertsData || []).map((alert) => {
          const product = productsById.get(Number(alert.product_id));
          const currentStock = Number(
            product?.current_stock ?? alert.current_value ?? 0
          );
          const threshold = getThresholdValue(alert);

          return {
            ...alert,
            current_value: currentStock,
            computed_resolved:
              isStockAlertResolved(alert) || currentStock >= threshold,
          };
        });

        const unresolved = alerts.filter((alert) => !isStockAlertResolved(alert));
        const promptKey = `stock-alert-login-prompt-${user.user_id}`;

        set_stock_alerts(alerts);

        if (
          showLoginPrompt &&
          unresolved.length > 0 &&
          sessionStorage.getItem(promptKey) === "pending"
        ) {
          set_is_stock_prompt_open(true);
          sessionStorage.setItem(promptKey, "shown");
        }

        if (!unresolved.length) {
          set_is_stock_prompt_open(false);
        }
      } catch (error) {
        console.error("Error cargando alertas de stock:", error.message);
      }
    };

    loadStockAlerts({ showLoginPrompt: true });

    const handleStockAlertsUpdated = () => {
      loadStockAlerts();
    };

    window.addEventListener(STOCK_ALERTS_UPDATED_EVENT, handleStockAlertsUpdated);

    const refreshInterval = window.setInterval(loadStockAlerts, 30000);

    return () => {
      isMounted = false;
      window.removeEventListener(
        STOCK_ALERTS_UPDATED_EVENT,
        handleStockAlertsUpdated
      );
      window.clearInterval(refreshInterval);
    };
  }, [user]);

  const openStockAlertsPage = () => {
    set_is_stock_prompt_open(false);
    set_is_notifications_open(false);
    navigate("/stock-alerts");
  };

  return (
    <header className="navbar navbar-admin">
      <div className="navbar-top">
        <div className="navbar-contact">
          <span>
            <Headphones size={16} />
            +1(809)-536-9114
          </span>

          <span>
            <Mail size={16} />
            ferreteriaelupina@gmail.com
          </span>
        </div>

        <Link to="/faq" className="navbar-faq">
          Preguntas Frecuentes (FAQ)
        </Link>
      </div>

      <div className="navbar-main">
        <Link to="/" className="navbar-logo">
          <img src="/logo-elupina.svg" alt="Ferreteria Elupina Admin" />
          <span>Admin</span>
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
            {unresolvedStockAlerts.length > 0 && (
              <small className="notification-count">
                {unresolvedStockAlerts.length}
              </small>
            )}
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

        <NavLink
          to="/stock-alerts"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Alertas Stock
        </NavLink>

        <NavLink
          to="/sobre-nosotros"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Sobre Nosotros
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
            {!unresolvedStockAlerts.length ? (
              <p>No hay alertas de stock pendientes.</p>
            ) : (
              <div className="notification-stock-list">
                {unresolvedStockAlerts.slice(0, 5).map((alert) => (
                  <button
                    type="button"
                    className="notification-stock-item"
                    key={alert.alert_id}
                    onClick={openStockAlertsPage}
                  >
                    <AlertTriangle size={18} />
                    <span>
                      <strong>{alert.product_name}</strong>
                      <small>
                        Stock actual: {alert.current_value ?? "N/A"} / mínimo:{" "}
                        {alert.thershold_value ?? alert.threshold_value ?? "N/A"}
                      </small>
                    </span>
                  </button>
                ))}

                {unresolvedStockAlerts.length > 5 && (
                  <p className="notification-more">
                    +{unresolvedStockAlerts.length - 5} alertas más
                  </p>
                )}

                <button
                  type="button"
                  className="notification-view-all"
                  onClick={openStockAlertsPage}
                >
                  Ver alertas de stock
                </button>
              </div>
            )}
          </div>
      </aside>

      {isStockPromptOpen && (
        <div className="stock-alert-prompt-overlay" role="dialog" aria-modal="true">
          <section className="stock-alert-prompt">
            <AlertTriangle size={34} />

            <div>
              <span>Alertas de stock</span>
              <h2>Hay productos con stock bajo</h2>
              <p>
                Tienes {unresolvedStockAlerts.length} alerta
                {unresolvedStockAlerts.length === 1 ? "" : "s"} pendiente
                {unresolvedStockAlerts.length === 1 ? "" : "s"} por revisar.
              </p>
            </div>

            <div className="stock-alert-prompt-actions">
              <button type="button" onClick={openStockAlertsPage}>
                Ver alertas
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => set_is_stock_prompt_open(false)}
              >
                Cerrar
              </button>
            </div>
          </section>
        </div>
      )}
    </header>
  );
}
