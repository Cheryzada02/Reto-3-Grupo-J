import { get_orders, update_orders } from "../authentication/db_functions";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  PencilIcon
} from "lucide-react";

import { useState, useEffect } from "react";


// =======================
// TABLE ROW
// =======================
function Order_Row({
  order,
  on_edit,
  is_editing,
  edit_values,
  on_change,
  on_save,
  on_cancel,
  on_view_details
}) {

  const format_currency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));
  };

  const date_time_display = (value) => {
    const original = new Date(value);
    return new Intl.DateTimeFormat('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(original);
  };

  return (
    <tr>
      <td>{order.order_id}</td>

      <td>{order.customer_name} </td>

      <td>
        {is_editing ? (
          <select
            name="order_status"
            value={edit_values.order_status || ""}
            onChange={on_change}
          >
            <option value="">-- Select --</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Procesando">Procesando</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        ) : order.order_status}
      </td>

      <td>
        {is_editing ? (
          <select
            name="payment_status"
            value={edit_values.payment_status || ""}
            onChange={on_change}
          >
            <option value="">-- Select --</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Pagado">Pagado</option>
            <option value="Devolución">Devolución</option>
          </select>
        ) : order.payment_status}
      </td>

      <td>{format_currency(order.subtotal)}</td>
      <td>{format_currency(order.tax)}</td>
      <td>{format_currency(order.discount)}</td>
      <td>{format_currency(order.total)}</td>
      <td>{date_time_display(order.created_at)}</td>

      <td className="table-actions">
        {is_editing ? (
          <>
            <button className="table-action-button" onClick={on_save}>Save</button>
            <button className="table-action-button" onClick={on_cancel}>Cancel</button>
          </>
        ) : (
          <>
            <button
              className="table-icon-button"
              onClick={() => on_edit(order)}
              aria-label="Editar orden"
              title="Editar orden"
            >
              <PencilIcon size={16} />
            </button>

            <button
              className="table-icon-button"
              onClick={() => on_view_details(order.order_id)}
              aria-label="Ver detalles"
              title="Ver detalles"
            >
              <Eye size={16} />
            </button>
          </>
        )}
      </td>
    </tr>
  );
}

// =======================
// TABLE
// =======================
function Order_Table({
  orders,
  on_edit,
  edit_row_id,
  edit_values,
  set_edit_values,
  on_save,
  on_cancel,
  on_view_details
}) {

  if (!orders.length) return <p>Cargando...</p>;

  const handle_change = (e) => {
    const { name, value } = e.target;

    set_edit_values(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="table-container admin-table-container">
      <table className="table admin-table orders-table">
        <thead>
          <tr>
            <th>ID Orden</th>
            <th>Cliente</th>
            <th>Estado Orden</th>
            <th>Estado Pago</th>
            <th>Subtotal</th>
            <th>Tax</th>
            <th>Descuento</th>
            <th>Total</th>
            <th>Creada En</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(m => (
            <Order_Row
              key={m.order_id}
              order={m}
              on_edit={on_edit}
              is_editing={edit_row_id === m.order_id}
              edit_values={edit_values}
              on_change={handle_change}
              on_save={on_save}
              on_cancel={on_cancel}
              on_view_details={on_view_details}
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
export default function Orders_Page() {

  const [orders, set_orders] = useState([]);
  const [edit_row_id, set_edit_row_id] = useState(null);
  const [edit_values, set_edit_values] = useState({});
  const navigate = useNavigate();

  const load_orders = async () => {
    try {
      const data = await get_orders();
      set_orders(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    load_orders();
  }, []);

  const handle_edit = (row) => {
    set_edit_row_id(row.order_id);
    set_edit_values(row);
  };

  const handle_save = async () => {
    try {

      await update_orders(edit_values.order_id, edit_values.order_status, edit_values.payment_status);

      set_orders(prev =>
        prev.map(o =>
          o.order_id === edit_row_id ? { ...o, ...edit_values } : o
        )
      );

      set_edit_row_id(null);
      set_edit_values({});

    } catch (err) {
      console.error("Error updating order:", err.message);
    }
  };

  const handle_cancel = () => {
    set_edit_row_id(null);
    set_edit_values({});
  };

  const handle_view_details = (order_id) => {
    navigate(`/orders_details?order_id=${encodeURIComponent(order_id)}`);
  };

  return (
    <div className="page-shell page-container">

      <div className="page-hero page-header-admin">
        <div>
          <span>Administración</span>
          <h1>Ordenes</h1>
          <p>Revisa el estado de las órdenes y actualiza su seguimiento.</p>
        </div>
      </div>

      <Order_Table
        orders={orders}
        on_edit={handle_edit}
        edit_row_id={edit_row_id}
        edit_values={edit_values}
        set_edit_values={set_edit_values}
        on_save={handle_save}
        on_cancel={handle_cancel}
        on_view_details={handle_view_details}
      />

    </div>
  );
}
