import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Eye, Search, X } from "lucide-react";

import { get_products, get_stock_alerts } from "../authentication/db_functions";
import { formatDateTime } from "../utils/dateFormat";
import TableExportActions from "../components/TableExportActions";

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

function isLowStockProduct(product) {
  return Number(product.current_stock || 0) < Number(product.min_stock || 0);
}

function getStockMissing(product) {
  return Math.max(
    Number(product.min_stock || 0) - Number(product.current_stock || 0),
    0
  );
}

const stockAlertsExportColumns = [
  { label: "Alerta", value: "alert_id" },
  { label: "Producto ID", value: "product_id" },
  { label: "Producto", value: "product_name" },
  { label: "Tipo", value: (row) => formatAlertType(row.alert_type) },
  { label: "Valor minimo", value: (row) => getThresholdValue(row) },
  { label: "Valor actual", value: "current_value" },
  {
    label: "Estado",
    value: (row) => (isAlertResolved(row) ? "Resuelta" : "Pendiente"),
  },
  { label: "Creada", value: (row) => formatDateTime(row.created_at) },
  { label: "Actualizada", value: (row) => formatDateTime(row.updated_at) },
];

const lowStockExportColumns = [
  { label: "Producto ID", value: "product_id" },
  { label: "Producto", value: "product_name" },
  { label: "Departamento", value: "department_name" },
  { label: "Suplidor", value: "supplier_name" },
  { label: "Stock actual", value: "current_stock" },
  { label: "Stock minimo", value: "min_stock" },
  { label: "Faltante", value: (row) => getStockMissing(row) },
  { label: "Estado", value: "status" },
];

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

function LowStockRow({ product, onViewDetail }) {
  return (
    <tr>
      <td>{product.product_id}</td>
      <td>
        <strong>{product.product_name}</strong>
      </td>
      <td>{product.department_name || "Sin departamento"}</td>
      <td>{product.supplier_name || "Sin suplidor"}</td>
      <td>
        <span className="tag tag-red">{product.current_stock ?? 0}</span>
      </td>
      <td>{product.min_stock ?? 0}</td>
      <td>
        <strong>{getStockMissing(product)}</strong>
      </td>
      <td>
        <button
          type="button"
          className="stock-detail-button"
          onClick={() => onViewDetail(product)}
          aria-label={`Ver detalle de ${product.product_name}`}
        >
          <Eye size={16} />
          Detalle
        </button>
      </td>
    </tr>
  );
}

function LowStockDetailModal({ product, onClose }) {
  if (!product) return null;

  return (
    <section className="modal-overlay">
      <div className="modal stock-detail-modal">
        <button
          type="button"
          className="stock-detail-close"
          onClick={onClose}
          aria-label="Cerrar detalle"
        >
          <X size={20} />
        </button>

        <div className="stock-detail-header">
          <img
            src={product.image_url || "/placeholder-product.png"}
            alt={product.product_name}
          />
          <div>
            <span>Stock bajo</span>
            <h2>{product.product_name}</h2>
            <p>{product.description || "Sin descripcion disponible."}</p>
          </div>
        </div>

        <div className="stock-detail-grid">
          <div>
            <span>Stock actual</span>
            <strong>{product.current_stock ?? 0}</strong>
          </div>
          <div>
            <span>Stock minimo</span>
            <strong>{product.min_stock ?? 0}</strong>
          </div>
          <div>
            <span>Faltante</span>
            <strong>{getStockMissing(product)}</strong>
          </div>
        </div>

        <div className="stock-detail-info">
          <p>
            <strong>Producto ID:</strong> {product.product_id}
          </p>
          <p>
            <strong>Departamento:</strong>{" "}
            {product.department_name || "Sin departamento"}
          </p>
          <p>
            <strong>Suplidor:</strong> {product.supplier_name || "Sin suplidor"}
          </p>
          <p>
            <strong>Estado:</strong> {product.status || "Sin estado"}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function StockAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedLowStockProduct, setSelectedLowStockProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const [alertsData, productsData] = await Promise.all([
          get_stock_alerts(),
          get_products(),
        ]);

        const productList = productsData || [];
        const productsById = new Map(
          productList.map((product) => [
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
        setProducts(productList);
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
  const lowStockProducts = products.filter(isLowStockProduct);
  const filteredAlerts = alerts.filter((alert) => {
    const search = searchText.trim().toLowerCase();

    if (!search) return true;

    return (
      (alert.product_name || "").toLowerCase().includes(search) ||
      (alert.alert_type || "").toLowerCase().includes(search) ||
      String(alert.product_id || "").includes(search)
    );
  });
  const filteredLowStockProducts = lowStockProducts.filter((product) => {
    const search = searchText.trim().toLowerCase();

    if (!search) return true;

    return (
      (product.product_name || "").toLowerCase().includes(search) ||
      (product.department_name || "").toLowerCase().includes(search) ||
      (product.supplier_name || "").toLowerCase().includes(search) ||
      String(product.product_id || "").includes(search)
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

        <article className="surface-card stock-alert-summary-card">
          <AlertTriangle size={28} />
          <div>
            <span>Stock &lt; Min</span>
            <strong>{lowStockProducts.length}</strong>
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

      <TableExportActions
        columns={stockAlertsExportColumns}
        rows={filteredAlerts}
        filename="alertas-stock.csv"
        title="Alertas de stock"
      />

      <section className="stock-low-section">
        <div className="stock-low-header">
          <div>
            <span>Funcion de stock bajo</span>
            <h2>Productos con Stock &lt; Min</h2>
            <p>
              Esta lista se calcula con el inventario actual del producto, no
              solo con la alerta registrada.
            </p>
          </div>

          <TableExportActions
            columns={lowStockExportColumns}
            rows={filteredLowStockProducts}
            filename="productos-stock-bajo.csv"
            title="Productos con stock bajo"
          />
        </div>

        {loading ? (
          <p className="estado">Cargando productos con stock bajo...</p>
        ) : !filteredLowStockProducts.length ? (
          <p className="estado">No hay productos con Stock menor al Minimo.</p>
        ) : (
          <div className="table-container admin-table-container">
            <table className="table admin-table stock-low-table">
              <thead>
                <tr>
                  <th>Producto ID</th>
                  <th>Producto</th>
                  <th>Departamento</th>
                  <th>Suplidor</th>
                  <th>Stock</th>
                  <th>Min</th>
                  <th>Faltante</th>
                  <th>Detalle</th>
                </tr>
              </thead>

              <tbody>
                {filteredLowStockProducts.map((product) => (
                  <LowStockRow
                    key={product.product_id}
                    product={product}
                    onViewDetail={setSelectedLowStockProduct}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

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

      <LowStockDetailModal
        product={selectedLowStockProduct}
        onClose={() => setSelectedLowStockProduct(null)}
      />
    </main>
  );
}
