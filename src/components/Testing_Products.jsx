import { get_products, insert_into_products, update_products, get_suppliers } from "../authentication/db_functions";
import { useState, useEffect } from "react";

function Product_card({ product, on_edit }) {

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP"
    }).format(value);
  };

  return ( 

    <div className="product-card">
      <div className="product-image">
        📦
      </div>

      <p className="product-title">{product.product_name}</p>

      <p className="product-info">{product.description}</p>
      <p className="product-info">{product.supplier_name}</p>
      <p className="product-info">{formatCurrency(product.cost_price)}</p>
      <p className="product-info">{formatCurrency(product.sale_price)}</p>
      <p className="product-info">{product.current_stock}</p>
      <p className="product-info">{product.min_stock}</p>
      <p className="product-info">{product.status}</p>


      <div className="product-actions">
        <button className="btn-edit" onClick={() => on_edit(product)}>
          ✏️ Edit
        </button>
      </div>
    </div>

  );
}


function Product_List ({products, on_edit }) {
  if (!products.length) return <p>No products found.</p>;

  return (
    <div className="products-grid">
      {products.map(product => (
        <Product_card
          key={product.product_id}
          product={product}
          on_edit={on_edit}
        />
      ))}
    </div>
  );
}

function Product_Form({ product, on_save, on_close }) {
  const [form, set_form] = useState({
    product_name: "",
    description: "",
    supplier_id: "",
    cost_price: "", 
    sale_price: "", 
    current_stock: "", 
    min_stock: ""
  });

  const [loading, set_loading] = useState(false)
  const [suppliers, set_suppliers] = useState([]);


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



  useEffect(() => {
    if (product) {
      set_form(product);
    }
  }, [product]);

  const handle_change = (e) => {
    const { name, value } = e.target;
    set_form(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handle_submit = async () => {
    if (!form.product_name.trim()) return alert("Nombre Es Requerido");
    if (!form.supplier_id) return alert("Suplidor Es Requerido");
    if (Number(form.cost_price) <= 0) {
      return alert("Costo debe ser mayor a 0");
    }

    if (Number(form.sale_price) <= 0) {
      return alert("Precio de venta debe ser mayor a 0");
    }

    if (Number(form.current_stock) < 0) {
      return alert("Inventario no puede ser negativo");
    }

    if (Number(form.min_stock) < 0) {
      return alert("Inventario minimo no puede ser negativo");
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
    <div className="modal-overlay">
      <div className="modal">
        <h2>{product ? "Edit Product" : "New Product"}</h2>

        <input name="product_name" placeholder="Nombre" value={form.product_name} onChange={handle_change} />
        <input name="description" placeholder="Descripcion" value={form.description} onChange={handle_change} />

        <select
            name="supplier_id"
            value={form.supplier_id}
            onChange={handle_change} >
          
          <option value="">-- Seleccione un suplidor --</option>
          {suppliers.map((s) => (
            <option key={s.supplier_id} value={s.supplier_id}>
              {s.name}
            </option>
          ))}
        </select>

        <input name="cost_price" placeholder="Costo" value={form.cost_price} onChange={handle_change} />
        <input name="sale_price" placeholder="Precio de Venta" value={form.sale_price} onChange={handle_change} />
        <input name="current_stock" placeholder="Inventario Actual" value={form.current_stock} onChange={handle_change} />
        <input name="min_stock" placeholder="Inventario Minimo" value={form.min_stock} onChange={handle_change} />

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

export default function Products_page() {
  const [products, set_products] = useState([]);
  const [selected_product, set_selected_product] = useState(null);
  const [is_modal_open, set_is_modal_open] = useState(false);

  const load_products = async () => {
    try {
      const data = await get_products();
      set_products(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    load_products();
  }, []); 

  const save_product = async (data) => {
    console.log(data);

    try {
      if (data.product_id) {
        const res = await update_products(data.product_id, data.product_name, data.description, data.supplier_id, data.cost_price, data.sale_price, data.current_stock, data.min_stock);
        alert("Product Updated Sucessfully!")
      }
        else {
        const res = await insert_into_products(data.product_name, data.description, data.supplier_id, data.cost_price, data.sale_price, data.current_stock, data.min_stock);
        alert("Product Added Successfully!");
      }

      await load_products();

    } catch (err) {
      if (err.message.includes("duplicate key value")) {
        alert("Product Already Exists In the Database")
      } else {
        console.log(err.message)
      }
    }
  }


  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Products</h1>

        <button
          className="btn-primary"
          onClick={() => {
            set_selected_product(null);
            set_is_modal_open(true);
          }}
        >
          ➕ Add Product
        </button>
      </div>

      <Product_List
        products={products}
        on_edit={(product) => {
          set_selected_product(product);
          set_is_modal_open(true);
        }}
      />

      {is_modal_open && (
        <Product_Form
          product={selected_product}
          on_save={save_product}
          on_close={() => set_is_modal_open(false)}
        />
      )}
    </div>
  );
}