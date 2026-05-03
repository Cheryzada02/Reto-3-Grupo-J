import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Search } from "lucide-react";

import { get_products, get_stock_alerts } from "../authentication/db_functions";
import { formatDateTime } from "../utils/dateFormat";

function formatAlertType(type) {
  if (!type) return "Alerta";

  return type
    .toString()
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getThresholdValue(alert) {
  return alert.thershold_value ?? alert.threshold_value ?? "N/A";
}

function isAlertResolved(alert) {
  if (typeof alert.computed_resolved === "boolean") {
    return alert.computed_resolved;
  }
  
  const value = alert.is_resolved;

  if (typeof value === "string") {
    return value.trim().toUpperCase() === "YES";
  }

  return Boolean(value);
}

function StockAlertRow({ alert }) {
  const resolved = isAlertResolved(alert);

  return (
    <tr>
      <td>{alert.alert_id}</td>
      <td>{alert.product_id}</td>
      <td>
        <strong>{alert.product_name}</strong>
      </td>
      <td>
        <span className={resolved ? "tag tag-green" : "tag tag-red"}>
          {formatAlertType(alert.alert_type)}
        </span>
      </td>
      <td>{getThresholdValue(alert)}</td>
      <td>{alert.current_value ?? "N/A"}</td>
      <td>
        <span className={resolved ? "tag tag-green" : "tag tag-yellow"}>
          {resolved ? "Resuelta" : "Pendiente"}
        </span>
      </td>
      <td>{formatDateTime(alert.created_at)}</td>
      <td>{formatDateTime(alert.updated_at)}</td>
    </tr>
  );
}

export default function StockAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const [alertsData, productsData] = await Promise.all([
          get_stock_alerts(),
          get_products(),
        ]);

        const productsById = new Map(
          (productsData || []).map((product) => [
            Number(product.product_id),
            product,
          ])
        );

        const refreshedAlerts = (alertsData || []).map((alert) => {
          const product = productsById.get(Number(alert.product_id));
          const currentStock = Number(
            product?.current_stock ?? alert.current_value ?? 0
          );
          const threshold = Number(
            alert.thershold_value ?? alert.threshold_value ?? Number.POSITIVE_INFINITY
          );

          return {
            ...alert,
            current_value: currentStock,
            computed_resolved: isAlertResolved(alert) || currentStock >= threshold,
          };
        });

        setAlerts(refreshedAlerts);
      } catch (error) {
        console.error("Error cargando alertas de stock:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();

    window.addEventListener("stock-alerts-updated", loadAlerts);

    return () => {
      window.removeEventListener("stock-alerts-updated", loadAlerts);
    };
  }, []);

  const unresolvedAlerts = alerts.filter((alert) => !isAlertResolved(alert));
  const filteredAlerts = alerts.filter((alert) => {
    const search = searchText.trim().toLowerCase();

    if (!search) return true;

    return (
      (alert.product_name || "").toLowerCase().includes(search) ||
      (alert.alert_type || "").toLowerCase().includes(search) ||
      String(alert.product_id || "").includes(search)
    );
  });

  return (
    <main className="page-shell page-container stock-alerts-page">
      <section className="page-hero page-header-admin">
        <div>
          <span>Administración</span>
          <h1>Alertas de Stock</h1>
          <p>
            Revisa productos con inventario bajo y alertas pendientes para
            planificar reposiciones.
          </p>
        </div>
      </section>

      <section className="stock-alerts-summary">
        <article className="surface-card stock-alert-summary-card">
          <AlertTriangle size={28} />
          <div>
            <span>Pendientes</span>
            <strong>{unresolvedAlerts.length}</strong>
          </div>
        </article>

        <article className="surface-card stock-alert-summary-card">
          <CheckCircle2 size={28} />
          <div>
            <span>Total registradas</span>
            <strong>{alerts.length}</strong>
          </div>
        </article>
      </section>

      <label className="admin-products-search stock-alerts-search">
        <Search size={18} />
        <input
          type="search"
          placeholder="Buscar por producto, tipo o ID"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
      </label>

      {loading ? (
        <p className="estado">Cargando alertas de stock...</p>
      ) : !filteredAlerts.length ? (
        <p className="estado">No hay alertas de stock para mostrar.</p>
      ) : (
        <div className="table-container admin-table-container">
          <table className="table admin-table stock-alerts-table">
            <thead>
              <tr>
                <th>Alerta</th>
                <th>Producto ID</th>
                <th>Producto</th>
                <th>Tipo</th>
                <th>Valor mínimo</th>
                <th>Valor actual</th>
                <th>Estado</th>
                <th>Creada</th>
                <th>Actualizada</th>
              </tr>
            </thead>

            <tbody>
              {filteredAlerts.map((alert) => (
                <StockAlertRow key={alert.alert_id} alert={alert} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
