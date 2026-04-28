

function Supplier_card({ supplier, on_edit }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "8px"
    }}>
      <h3>{supplier.name}</h3>
      <p><b>Phone:</b> {supplier.phone}</p>
      <p><b>Email:</b> {supplier.email}</p>
      <p><b>Address:</b> {supplier.address}</p>

      <button onClick={() => on_edit(supplier)}>
        ✏️ Edit
      </button>
    </div>
  );
}

// import SupplierCard from "./SupplierCard";
function Supplier_List ({ suppliers, on_edit }) {
  if (!suppliers.length) return <p>No suppliers found.</p>;

  return (
    <div>
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


import { useState, useEffect } from "react";
function Supplier_Form({ supplier, on_save, on_close }) {
  const [form, set_form] = useState({
    name: "",
    phone: "",
    email: "", 
    address: ""
  });

  const [loading, set_loading] = useState(false)

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
    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!form.email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      set_loading(true)
      await on_save(form);
      on_close();
    } catch (err) {
      console.error(err);
    }
    finally {
      set_loading(false)
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)"
    }}>
      <div style={{
        background: "white",
        padding: "20px",
        margin: "10% auto",
        width: "300px",
        borderRadius: "8px"
      }}>
        <h2>{supplier ? "Edit Supplier" : "New Supplier"}</h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handle_change}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handle_change}
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handle_change}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handle_change}
        />

        <br /><br />

        <button onClick={handle_submit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>

        <button onClick={on_close} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}


// import SupplierList from "../components/SupplierList";
// import SupplierForm from "../components/SupplierForm";

// import {
//   fetch_suppliers,
//   insert_supplier,
//   update_supplier
// } from "../services/supplierService";

import { get_suppliers, insert_into_suppliers, update_suppliers } from "../authentication/db_functions";

export default function Supplier_page() {
  const [suppliers, set_suppliers] = useState([]);
  const [selected_supplier, set_selected_supplier] = useState(null);
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [result, set_result] = useState(null)
  

  // LOAD DATA
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
        const res = await update_suppliers(data.supplier_id, data.name, data.phone, data.email, data.address);
        alert("Supplier Updated Sucessfully!")
      }
        else {
        const res = await insert_into_suppliers(data.name, data.phone, data.email, data.address)
        alert("Supplier Added Successfully!");
      }

      await load_suppliers();

    } catch (err) {
      if (err.message.includes("duplicate key value")) {
        alert("Supplier Already Exists In the Database")
      } else {
        console.log(err.message)
      }
    }
  }


  return (
    <div style={{ padding: "20px" }}>
      <h1>Suppliers</h1>

      <button onClick={() => {
        set_selected_supplier(null);
        set_is_modal_open(true);
      }}>
        ➕ Add Supplier
      </button>

      <hr />

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