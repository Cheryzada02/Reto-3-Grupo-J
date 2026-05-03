import { useState, useEffect } from "react";
import { get_suppliers, insert_into_suppliers, update_suppliers } from "../authentication/db_functions";
import { useAlerts } from "../context/AlertContext";
import {
  PlusSquareIcon, PencilIcon
} from "lucide-react";

function Supplier_card({ supplier, on_edit }) {
  return (
    <div className="surface-card interactive-card product-card">

      <p className="product-title">
        {supplier.name}
      </p>

      <p className="product-info">
        <strong>Teléfono: </strong> {supplier.phone}
      </p>

      <p className="product-info">
        <strong>Email: </strong> {supplier.email}
      </p>

      <p className="product-info">
        <strong>Dirección: </strong> {supplier.address}
      </p>

      <div className="product-actions">
        <button className="btn" onClick={() => on_edit(supplier)}>
          <span>
            <PencilIcon size={18} />
            Editar
          </span>
        </button>
      </div>
    </div>
  );
}

function Supplier_List({ suppliers, on_edit }) {
  if (!suppliers.length) return <p>Cargando Suplidores...</p>;

  return (
    <div className="responsive-grid product-grid products-grid">
      {suppliers.map(supplier => (
        <Supplier_card
          key={supplier.supplier_id}
          supplier={supplier}
          on_edit={on_edit}
        />
      ))}
    </div>
  );
}

function Supplier_Form({ supplier, on_save, on_close }) {
  const { showAlert } = useAlerts();

  const [form, set_form] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  const [loading, set_loading] = useState(false);

  useEffect(() => {
    if (supplier) {
      set_form(supplier);
    }
  }, [supplier]);

  const handle_change = (e) => {
    const { name, value } = e.target;
    set_form(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handle_submit = async () => {
    if (!form.name.trim()) return showAlert("Name is required", "error");
    if (!form.email.trim()) return showAlert("Email is required", "error");

    try {
      set_loading(true);
      await on_save(form);
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
        <h2>{supplier ? "Editar Suplidor" : "Nuevo Suplidor"}</h2>

        <input name="name" placeholder="Name" value={form.name} onChange={handle_change} />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handle_change} />
        <input name="email" placeholder="Email" value={form.email} onChange={handle_change} />
        <input name="address" placeholder="Address" value={form.address} onChange={handle_change} />

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


export default function Supplier_page() {
  const [suppliers, set_suppliers] = useState([]);
  const [selected_supplier, set_selected_supplier] = useState(null);
  const [is_modal_open, set_is_modal_open] = useState(false);
  const { showAlert } = useAlerts();

  const load_suppliers = async () => {
    try {
      const data = await get_suppliers();
      set_suppliers(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    load_suppliers();
  }, []);

  const save_supplier = async (data) => {
    try {
      if (data.supplier_id) {
        await update_suppliers(
          data.supplier_id,
          data.name,
          data.phone,
          data.email,
          data.address
        );
        showAlert("Supplier Updated Successfully!", "success");
      } else {
        await insert_into_suppliers(
          data.name,
          data.phone,
          data.email,
          data.address
        );
        showAlert("Supplier Added Successfully!", "success");
      }

      await load_suppliers();

    } catch (err) {
      if (err.message.includes("duplicate key value")) {
        showAlert("Supplier Already Exists In the Database", "error");
      } else {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="page-shell page-container">

      <div className="page-hero page-header-admin">
        <div>
          <span>Administración</span>
          <h1>Suplidores</h1>
          <p>Mantén actualizada la información de contacto de los suplidores.</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            set_selected_supplier(null);
            set_is_modal_open(true);
          }}
        >
          <span>
            <PlusSquareIcon size={18} />
            Agregar Suplidor
          </span>
        </button>
      </div>

      <Supplier_List
        suppliers={suppliers}
        on_edit={(supplier) => {
          set_selected_supplier(supplier);
          set_is_modal_open(true);
        }}
      />

      {is_modal_open && (
        <Supplier_Form
          supplier={selected_supplier}
          on_save={save_supplier}
          on_close={() => set_is_modal_open(false)}
        />
      )}
    </div>
  );
}
