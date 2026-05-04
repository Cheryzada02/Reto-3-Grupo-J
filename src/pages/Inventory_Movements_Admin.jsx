import {
  get_inventory_movements,
  insert_inventory_movement,
  get_products,
} from "../authentication/db_functions";
import { useAuth } from  "../context/AuthContext";
import { useAlerts } from "../context/AlertContext";
import {
  PlusIcon
} from "lucide-react";

import { useState, useEffect } from "react";
import { formatDateTime } from "../utils/dateFormat";
import TableExportActions from "../components/TableExportActions";

const inventoryExportColumns = [
  { label: "Fecha", value: (row) => formatDateTime(row.movement_date) },
  { label: "Producto", value: "product_name" },
  { label: "Tipo", value: "movement_type" },
  { label: "Cantidad", value: "quantity" },
  { label: "Usuario", value: "user_name" },
  { label: "Email Usuario", value: "user_email" },
  { label: "Referencia", value: "reference" },
  { label: "Notas", value: "notes" },
];


// =======================
// TABLE ROW
// =======================
function Movement_Row({ movement }) {

  const get_type_class = (type) => {
    if (type === "ENTRADA") return "tag tag-green";
    if (type === "SALIDA") return "tag tag-red";
    if (type === "VENTA") return "tag tag-red";
    return "tag tag-yellow";
  };

  return (
    <tr>
      <td>{formatDateTime(movement.movement_date)}</td>
      <td>{movement.product_name}</td>
      <td>
        <span className={get_type_class(movement.movement_type)}>
          {movement.movement_type}
        </span>
      </td>
      <td>{movement.quantity}</td>
      <td>{movement.user_name}</td>
      <td>{movement.user_email}</td>
      <td>{movement.reference}</td>
      <td>{movement.notes}</td>

    </tr>
  );
}


// =======================
// TABLE
// =======================
function Movement_Table({ movements }) {
  if (!movements.length) return <p>Cargando...</p>;

  return (
    <div className="table-container admin-table-container">
      <table className="table admin-table inventory-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Tipo</th>
            <th>Cantidad</th>
            <th>Usuario</th>
            <th>Email Usuario</th>
            <th>Referencia</th>
            <th>Notas</th>
          </tr>
        </thead>

        <tbody>
          {movements.map(m => (
            <Movement_Row
              key={m.movement_id}
              movement={m}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}


// =======================
// FORM MODAL
// =======================
function Movement_Form({ movement, on_save, on_close }) {

    const { user } = useAuth();
    const { showAlert } = useAlerts();
    
    const [form, set_form] = useState({
        product_id: "",
        movement_type: "",
        quantity: "",
        reference: "",
        notes: ""
    });

    const [products, set_products] = useState([]);
    const [loading, set_loading] = useState(false);

    useEffect(() => {
        if (movement) set_form(movement);
    }, [movement]);

    useEffect(() => {
        load_products();
    }, []);

    const load_products = async () => {
        try {
            const data = await get_products();
            set_products(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handle_change = (e) => {
        const { name, value } = e.target;
        set_form(prev => ({ ...prev, [name]: value }));
    };

    const handle_submit = async () => {
        if (!form.product_id) return showAlert("Producto requerido", "error");
        if (!form.movement_type) return showAlert("Tipo requerido", "error");
        if (Number(form.quantity) <= 0) return showAlert("Cantidad inválida", "error");

        let user_id = user.user_id;

        const final_form = {
            ...form,
            user_id: user.user_id
        };

        try {
            set_loading(true);
            await on_save(final_form);
            on_close();
        } catch (err) {
            console.error(err);
        } finally {
            set_loading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{movement ? "Editar Movimiento" : "Nuevo Movimiento"}</h2>

                <select name="product_id" value={form.product_id} onChange={handle_change}>
                <option value="">-- Producto --</option>
                {products.map(p => (
                    <option key={p.product_id} value={p.product_id}>
                    {p.product_name}
                    </option>
                ))}
                </select>

                <select name="movement_type" value={form.movement_type} onChange={handle_change}>
                    <option value="">-- Tipo --</option>
                    <option value="ENTRADA">Entrada</option>
                    <option value="SALIDA">Salida</option>
                </select>

                <input
                    name="quantity"
                    placeholder="Cantidad"
                    value={form.quantity}
                    onChange={handle_change}
                />

                <input
                    name="reference"
                    placeholder="Referencia"
                    value={form.reference}
                    onChange={handle_change}
                />

                <input
                    name="notes"
                    placeholder="Notas"
                    value={form.notes}
                    onChange={handle_change}
                />

                <div className="modal-actions">
                    <button onClick={handle_submit} disabled={loading}>
                        {loading ? "Guardando..." : "Guardar"}
                    </button>

                    <button className="btn-secondary" onClick={on_close}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}


// =======================
// MAIN PAGE
// =======================
export default function Inventory_movements() {

  const [movements, set_movements] = useState([]);
  const [selected, set_selected] = useState(null);
  const [is_modal_open, set_is_modal_open] = useState(false);
  const { showAlert } = useAlerts();

  const load_movements = async () => {
    try {
      const data = await get_inventory_movements();
      set_movements(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    load_movements();
  }, []);

  const save_movement = async (data) => {
    try {

        await insert_inventory_movement(
            data.product_id,
            data.user_id,
            data.movement_type,
            data.quantity,
            data.reference,
            data.notes
        );
        showAlert("Movimiento agregado correctamente.", "success");

        await load_movements();
        window.dispatchEvent(new Event("stock-alerts-updated"));

    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="page-shell page-container">

      <div className="page-hero page-header-admin">
        <div>
          <span>Administración</span>
          <h1>Movimientos De Inventario</h1>
          <p>Registra entradas, salidas y ajustes para mantener el inventario claro.</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            set_selected(null);
            set_is_modal_open(true);
          }}
        >
          <span>
            <PlusIcon size={18} />
            Agregar Movimiento
          </span>
        </button>
      </div>

      <TableExportActions
        columns={inventoryExportColumns}
        rows={movements}
        filename="movimientos-inventario.csv"
        title="Movimientos de inventario"
      />

      <Movement_Table
        movements={movements}
      />

      {is_modal_open && (
        <Movement_Form
          movement={selected}
          on_save={save_movement}
          on_close={() => set_is_modal_open(false)}
        />
      )}
    </div>
  );
}
