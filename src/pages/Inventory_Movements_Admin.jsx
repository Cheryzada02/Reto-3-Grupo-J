import {
  get_inventory_movements,
  insert_inventory_movement,
  get_products,
} from "../authentication/db_functions";
import { useAuth } from  "../authentication/AuthContext";

import { useState, useEffect } from "react";


// =======================
// TABLE ROW
// =======================
function Movement_Row({ movement, on_edit }) {

  const get_type_class = (type) => {
    if (type === "ENTRADA") return "tag tag-green";
    if (type === "SALIDA") return "tag tag-red";
    if (type === "VENTA") return "tag tag-red";
    return "tag tag-yellow";
  };

  return (
    <tr>
      <td>{new Date(movement.movement_date).toLocaleDateString("es-DO")}</td>
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

    </tr>
  );
}


// =======================
// TABLE
// =======================
function Movement_Table({ movements, on_edit }) {
  if (!movements.length) return <p>Cargando...</p>;

  return (
    <div className="table-container">
      <table className="table">
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
              on_edit={on_edit}
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
        if (!form.product_id) return alert("Producto requerido");
        if (!form.movement_type) return alert("Tipo requerido");
        if (Number(form.quantity) <= 0) return alert("Cantidad inválida");

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
                <h2>{movement ? "Edit Movement" : "New Movement"}</h2>

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
                        {loading ? "Saving..." : "Save"}
                    </button>

                    <button className="btn-secondary" onClick={on_close}>
                        Cancel
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
        alert("Movement added!");


        await load_movements();

    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="page-container">

      <div className="page-header">
        <h1>Inventory Movements</h1>

        <button
          className="btn-primary"
          onClick={() => {
            set_selected(null);
            set_is_modal_open(true);
          }}
        >
          ➕ Add Movement
        </button>
      </div>

      <Movement_Table
        movements={movements}
        on_edit={(m) => {
          set_selected(m);
          set_is_modal_open(true);
        }}
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