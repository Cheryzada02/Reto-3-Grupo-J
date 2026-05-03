import { get_orders_details } from "../authentication/db_functions";
import { useSearchParams } from "react-router-dom";
import {
  Search
} from "lucide-react";

import { useState, useEffect } from "react";


// =======================
// TABLE ROW
// =======================
function Order_Details_Row({ order_detail }) {

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));
  };

  const Date_Time_Display = ( value ) => {

    const original = new Date(value);
    const shifted = new Date(original.getTime() - 4 * 60 * 60 * 1000);

    const formatted = new Intl.DateTimeFormat('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(shifted);

    return formatted;
  }

  return (
    <tr>
      <td>{order_detail.order_item_id}</td>
      <td>{order_detail.order_status}</td>
      <td>{order_detail.product_name}</td>
      <td>{order_detail.quantity}</td>
      <td>{formatCurrency(order_detail.unit_price)}</td>
      <td>{formatCurrency(order_detail.discount)}</td>
      <td>{formatCurrency(order_detail.line_total)}</td>
      <td>{Date_Time_Display(order_detail.created_at)}</td>
      <td>{Date_Time_Display(order_detail.updated_at)}</td>
    </tr>
  );
}


// =======================
// TABLE
// =======================
function Order_details_Table({ order_detail, emptyText }) {
  if (!order_detail.length) return <p className="estado">{emptyText}</p>;

  return (
    <div className="table-container admin-table-container">
      <table className="table admin-table order-details-table">
        <thead>
          <tr>
            <th>ID Articulo</th>
            <th>Estado Orden</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Descuento</th>
            <th>Total</th>
            <th>Creado En</th>
            <th>Actualizado En</th>
          </tr>
        </thead>

        <tbody>
          {order_detail.map(m => (
            <Order_Details_Row
              key={m.order_item_id}
              order_detail={m}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}


// =======================
// MAIN PAGE
// =======================
export default function Orders_detail_Page() {

  const [orders_detail, set_orders_detail] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusSearch, setStatusSearch] = useState(searchParams.get("status") || "");

  const load_orders_detail = async () => {
    try {
      const data = await get_orders_details();
      set_orders_detail(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    load_orders_detail();
  }, []);

  useEffect(() => {
    setStatusSearch(searchParams.get("status") || "");
  }, [searchParams]);

  const filtered_orders_detail = orders_detail.filter((detail) => {
    const orderIdSearch = searchParams.get("order_id") || "";
    const cleanStatusSearch = statusSearch.trim().toLowerCase();

    const matchesOrderId =
      !orderIdSearch || String(detail.order_id || "") === orderIdSearch;

    const matchesStatus =
      !cleanStatusSearch ||
      (detail.order_status || "").toLowerCase().includes(cleanStatusSearch);

    return matchesOrderId && matchesStatus;
  });

  const handleStatusSearch = (event) => {
    const value = event.target.value;
    setStatusSearch(value);

    const nextParams = {};
    const orderIdSearch = searchParams.get("order_id");

    if (orderIdSearch) {
      nextParams.order_id = orderIdSearch;
    }

    if (value.trim()) {
      nextParams.status = value.trim();
    }

    setSearchParams(nextParams);
  };

  const handleViewAll = () => {
    setStatusSearch("");
    setSearchParams({});
  };

  return (
    <div className="page-shell page-container">

      <div className="page-hero page-header-admin">
        <div>
          <span>Administración</span>
          <h1>Detalle Ordenes</h1>
          <p>Consulta los productos, cantidades y totales asociados a cada orden.</p>
        </div>
      </div>

      <div className="admin-table-toolbar">
        <label className="admin-table-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar por estado de orden"
            value={statusSearch}
            onChange={handleStatusSearch}
          />
        </label>

        <button
          type="button"
          className="btn admin-table-clear"
          onClick={handleViewAll}
        >
          Ver todos
        </button>
      </div>

      <Order_details_Table
        order_detail={filtered_orders_detail}
        emptyText={
          statusSearch.trim() || searchParams.get("order_id")
            ? "No encontramos detalles con ese filtro."
            : "Cargando..."
        }
      />

    </div>
  );
}
