import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  PackageCheck,
  ReceiptText,
} from "lucide-react";

import {
  get_inventory_movements,
  get_orders,
  get_orders_details,
  get_products,
  get_stock_alerts,
} from "../authentication/db_functions";
import { formatDateTime } from "../utils/dateFormat";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
  }).format(Number(value || 0));
}

function getNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function getThresholdValue(alert) {
  return Number(
    alert.thershold_value ?? Number.POSITIVE_INFINITY
  );
}

function isAlertResolved(alert) {
  if (typeof alert.computed_resolved === "boolean") {
    return alert.computed_resolved;
  }

  if (typeof alert.is_resolved === "string") {
    return alert.is_resolved.trim().toUpperCase() === "YES";
  }

  return Boolean(alert.is_resolved);
}

function normalizeDate(value) {
  const dateValue = new Date(value || 0).getTime();
  return Number.isFinite(dateValue) ? dateValue : 0;
}

function getStatusClass(status) {
  const cleanStatus = (status || "").toLowerCase();

  if (cleanStatus.includes("complet")) return "tag tag-green";
  if (cleanStatus.includes("cancel")) return "tag tag-red";
  if (cleanStatus.includes("proces")) return "tag tag-yellow";
  return "tag";
}

function getMovementIcon(type) {
  return type === "ENTRADA" ? <ArrowUpRight size={17} /> : <ArrowDownRight size={17} />;
}

function SummaryCard({ icon, label, value, helper }) {
  const isWideValue = String(value).length > 10;

  return (
    <article
      className={
        isWideValue
          ? "surface-card dashboard-summary-card dashboard-summary-card-wide"
          : "surface-card dashboard-summary-card"
      }
    >
      <span className="dashboard-summary-icon">{icon}</span>
      <div>
        <p>{label}</p>
        <strong title={String(value)}>{value}</strong>
        <small>{helper}</small>
      </div>
    </article>
  );
}

function BarList({ items, emptyText }) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  if (!items.length) {
    return <p className="dashboard-empty">{emptyText}</p>;
  }

  return (
    <div className="dashboard-bar-list">
      {items.map((item) => (
        <div className="dashboard-bar-row" key={item.label}>
          <div className="dashboard-bar-label">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
          <div className="dashboard-bar-track" aria-hidden="true">
            <span style={{ width: `${Math.max((item.value / maxValue) * 100, 8)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardAdmin() {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [movements, setMovements] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          ordersData,
          detailsData,
          movementsData,
          alertsData,
          productsData,
        ] = await Promise.all([
          get_orders(),
          get_orders_details(),
          get_inventory_movements(),
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
          const currentStock = getNumber(
            product?.current_stock ?? alert.current_value
          );
          const threshold = getThresholdValue(alert);

          return {
            ...alert,
            current_value: currentStock,
            computed_resolved: isAlertResolved(alert) || currentStock >= threshold,
          };
        });

        setOrders(ordersData || []);
        setOrderDetails(detailsData || []);
        setMovements(movementsData || []);
        setAlerts(refreshedAlerts);
      } catch (error) {
        console.error("Error cargando dashboard:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const dashboardData = useMemo(() => {
    const recentOrders = [...orders]
      .sort((a, b) => normalizeDate(b.created_at) - normalizeDate(a.created_at))
      .slice(0, 5);

    const recentMovements = [...movements]
      .sort(
        (a, b) =>
          normalizeDate(b.movement_date) - normalizeDate(a.movement_date)
      )
      .slice(0, 6);

    const pendingAlerts = alerts.filter((alert) => !isAlertResolved(alert));
    const totalSales = orders.reduce(
      (sum, order) => sum + getNumber(order.total),
      0
    );
    const completedOrders = orders.filter((order) =>
      (order.order_status || "").toLowerCase().includes("complet")
    ).length;

    const movementTotals = movements.reduce(
      (totals, movement) => {
        const type = movement.movement_type || "OTRO";
        totals[type] = (totals[type] || 0) + getNumber(movement.quantity);
        return totals;
      },
      {}
    );

    const orderStatusItems = Object.entries(
      orders.reduce((totals, order) => {
        const status = order.order_status || "Sin estado";
        totals[status] = (totals[status] || 0) + 1;
        return totals;
      }, {})
    ).map(([label, value]) => ({ label, value }));

    const movementItems = Object.entries(movementTotals).map(
      ([label, value]) => ({ label, value })
    );

    const topProducts = Object.values(
      orderDetails.reduce((products, detail) => {
        const name = detail.product_name || "Producto sin nombre";

        products[name] = products[name] || { label: name, value: 0 };
        products[name].value += getNumber(detail.quantity);

        return products;
      }, {})
    )
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      completedOrders,
      movementItems,
      orderStatusItems,
      pendingAlerts,
      recentMovements,
      recentOrders,
      topProducts,
      totalSales,
    };
  }, [alerts, movements, orderDetails, orders]);

  return (
    <main className="page-shell page-container dashboard-admin-page">
      <section className="page-hero page-header-admin dashboard-hero">
        <div>
          <span>Administracion</span>
          <h1>Dashboard</h1>
          <p>
            Vista rapida de ordenes, movimientos de inventario y alertas de
            stock.
          </p>
        </div>
      </section>

      <section className="dashboard-summary-grid">
        <SummaryCard
          icon={<ReceiptText size={24} />}
          label="Ventas Registradas"
          value={formatCurrency(dashboardData.totalSales)}
          helper={`${orders.length} ordenes en total`}
        />
        <SummaryCard
          icon={<PackageCheck size={24} />}
          label="Ordenes Completadas"
          value={dashboardData.completedOrders}
          helper="Seguimiento de pedidos"
        />
        <SummaryCard
          icon={<Boxes size={24} />}
          label="Movimientos"
          value={movements.length}
          helper="Entradas, salidas y ventas"
        />
        <SummaryCard
          icon={<AlertTriangle size={24} />}
          label="Alertas Pendientes"
          value={dashboardData.pendingAlerts.length}
          helper="Productos por revisar"
        />
      </section>

      <section className="dashboard-grid">
        <article className="surface-card dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>Ordenes</span>
              <h2>Estado de ordenes</h2>
            </div>
            <Link to="/orders">Ver Ordenes</Link>
          </div>

          <BarList
            items={dashboardData.orderStatusItems}
            emptyText={loading ? "Cargando ordenes..." : "No hay ordenes para mostrar."}
          />
        </article>

        <article className="surface-card dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>Inventario</span>
              <h2>Movimientos por tipo</h2>
            </div>
            <Link to="/inventory_movements">Ver Inventario</Link>
          </div>

          <BarList
            items={dashboardData.movementItems}
            emptyText={
              loading
                ? "Cargando movimientos..."
                : "No hay movimientos para mostrar."
            }
          />
        </article>

        <article className="surface-card dashboard-panel dashboard-wide-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>Pedidos</span>
              <h2>Ultimas Ordenes</h2>
            </div>
            <Link to="/orders">Ver Ordernes</Link>
          </div>

          <div className="dashboard-order-list">
            {dashboardData.recentOrders.length ? (
              dashboardData.recentOrders.map((order) => (
                <div className="dashboard-order-item" key={order.order_id}>
                  <span>
                    <strong>#{order.order_id}</strong>
                    <small>{formatDateTime(order.created_at)}</small>
                  </span>
                  <span>{order.customer_name}</span>
                  <span className={getStatusClass(order.order_status)}>
                    {order.order_status}
                  </span>
                  <strong>{formatCurrency(order.total)}</strong>
                </div>
              ))
            ) : (
              <p className="dashboard-empty">
                {loading ? "Cargando ordenes..." : "No hay ordenes recientes."}
              </p>
            )}
          </div>
        </article>

        <article className="surface-card dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>Productos</span>
              <h2>Mas Vendidos</h2>
            </div>
            <Link to="/orders_details">Ver Detalles</Link>
          </div>

          <BarList
            items={dashboardData.topProducts}
            emptyText={
              loading
                ? "Cargando detalles..."
                : "No hay productos vendidos para mostrar."
            }
          />
        </article>

        <article className="surface-card dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>Alertas</span>
              <h2>Stock Pendiente</h2>
            </div>
            <Link to="/stock-alerts">Ver Alertas</Link>
          </div>

          <div className="dashboard-alert-list">
            {dashboardData.pendingAlerts.slice(0, 5).map((alert) => (
              <div className="dashboard-alert-item" key={alert.alert_id}>
                <AlertTriangle size={18} />
                <span>
                  <strong>{alert.product_name}</strong>
                  <small>
                    Stock: {alert.current_value ?? "N/A"} / minimo:{" "}
                    {alert.thershold_value ?? alert.threshold_value ?? "N/A"}
                  </small>
                </span>
              </div>
            ))}

            {!dashboardData.pendingAlerts.length && (
              <p className="dashboard-empty">
                {loading ? "Cargando alertas..." : "No hay alertas pendientes."}
              </p>
            )}
          </div>
        </article>

        <article className="surface-card dashboard-panel dashboard-wide-panel">
          <div className="dashboard-panel-header">
            <div>
              <span>Inventario</span>
              <h2>Ultimos Movimientos</h2>
            </div>
            <Link to="/inventory_movements">Registrar Movimiento</Link>
          </div>

          <div className="dashboard-movement-list">
            {dashboardData.recentMovements.length ? (
              dashboardData.recentMovements.map((movement) => (
                <div className="dashboard-movement-item" key={movement.movement_id}>
                  <span className="dashboard-movement-icon">
                    {getMovementIcon(movement.movement_type)}
                  </span>
                  <span>
                    <strong>{movement.product_name || "Producto no disponible"}</strong>
                    <small>{formatDateTime(movement.movement_date)}</small>
                  </span>
                  <span className="tag">{movement.movement_type || "Movimiento"}</span>
                  <strong>{getNumber(movement.quantity)}</strong>
                </div>
              ))
            ) : (
              <p className="dashboard-empty">
                {loading
                  ? "Cargando movimientos..."
                  : "No hay movimientos recientes."}
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
