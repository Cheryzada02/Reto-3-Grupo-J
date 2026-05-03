import { get_products, insert_into_products, update_products, get_suppliers, insert_inventory_movement, get_departments } from "../authentication/db_functions";
import { useState, useEffect } from "react";
import { upload_image } from "../authentication/db_functions";
import { delete_image } from "../authentication/db_functions";
import { useAuth } from  "../context/AuthContext";
import { useAlerts } from "../context/AlertContext";
import { PencilIcon, PlusSquareIcon, Search } from "lucide-react";

function Product_card({ product, on_edit }) {

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(Number(value || 0));
  };


  return ( 

    <div className="surface-card interactive-card product-card">
      <div className="product-image">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} loading="lazy"/>
        ) : (
          <span>📦</span>
        )}
      </div>

      <div className="admin-product-content">
        <div className="admin-product-title">
          <span>Nombre</span>
          <h2>{product.product_name}</h2>
        </div>

        <div className="admin-product-fields">
          <p className="product-info"><strong>Descripcion</strong> <span>{product.description}</span></p>
          <p className="product-info"><strong>Suplidor</strong> <span>{product.supplier_name}</span></p>
          <p className="product-info"><strong>Departamento</strong> <span>{product.depar || "Sin departamento"}</span></p>
          <p className="product-info"><strong>Precio Costo</strong><span>{formatCurrency(product.cost_price)}</span></p>
          <p className="product-info"><strong>Precio Venta</strong><span>{formatCurrency(product.sale_price)}</span></p>
          <p className="product-info"><strong>Stock</strong><span>{product.current_stock}</span></p>
          <p className="product-info"><strong>Stock Minimo</strong><span>{product.min_stock}</span></p>
          <p className="product-info"><strong>Estado</strong><span>{product.status}</span></p>
        </div>

        <div className="product-actions">
          <button className="btn" onClick={() => on_edit(product)}>
            <span>
              <PencilIcon size={18} />
              Editar
            </span>
          </button>
        </div>
      </div>
    </div>

  );
}


function Product_List ({products, on_edit, columnas, emptyText }) {
  if (!products.length) return <p className="estado">{emptyText}</p>;

  return (
    <div className={`responsive-grid admin-products-grid admin-products-grid-${columnas}`}>
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
  const { showAlert } = useAlerts();

  const [form, set_form] = useState({
    product_name: "",
    description: "",
    supplier_id: "",
    cost_price: "", 
    sale_price: "", 
    current_stock: "", 
    min_stock: "",
    status: "",
    image_url: "",
    department_id: ""
  });

  const [loading, set_loading] = useState(false)
  const [suppliers, set_suppliers] = useState([]);
  const [departments, set_departments] = useState([]);
  const [product_status, set_status] = useState([]);
  const [image_file, set_image_file] = useState(null);

  useEffect(() => {
    const data_status = [
      { status: "Activo", label: "Activo" },
      { status: "Inactivo", label: "Inactivo" },
      { status: "Descontinuado", label: "Descontinuado" }
    ];

    set_status(data_status);
  }, []);


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

  const load_departments = async () => {
    try {
      const data = await get_departments();
      set_departments(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    load_departments();
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
    if (!form.product_name.trim()) return showAlert("Nombre Es Requerido", "error");
    if (!form.supplier_id) return showAlert("Suplidor Es Requerido", "error");

    if (Number(form.cost_price) <= 0) return showAlert("Costo debe ser mayor a 0", "error");
    if (Number(form.sale_price) <= 0) return showAlert("Precio de venta debe ser mayor a 0", "error");
    if (Number(form.current_stock) < 0) return showAlert("Inventario no puede ser negativo", "error");
    if (Number(form.min_stock) < 0) return showAlert("Inventario minimo no puede ser negativo", "error");
    if (!form.status) return showAlert("Estado Es Requerido", "error");

    try {
      set_loading(true);

      let image_url = form.image_url;

      if (image_file) {
        image_url = await upload_image(image_file, 'Products');

        if (form.image_url) {
          await delete_image(form.image_url);
        }
      }

      const final_form = {
        ...form,
        image_url
      };

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
        <h2>{product ? "Editar Producto" : "Nuevo Producto"}</h2>

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

        <select
            name="department_id"
            value={form.department_id}
            onChange={handle_change} >
          
          <option value="">-- Seleccione un Departamento --</option>
          {suppliers.map((s) => (
            <option key={s.department_id} value={s.department_id}>
              {s.name}
            </option>
          ))}
        </select>

        <input name="cost_price" placeholder="Costo" value={form.cost_price} onChange={handle_change} />
        <input name="sale_price" placeholder="Precio de Venta" value={form.sale_price} onChange={handle_change} />
        <input name="current_stock" placeholder="Inventario Actual" value={form.current_stock} onChange={handle_change} disabled={product ? true: false} />
        <input name="min_stock" placeholder="Inventario Minimo" value={form.min_stock} onChange={handle_change} />

        <select
            name="status"
            value={form.status}
            onChange={handle_change} >
          
          <option value="">-- Seleccione un Estado --</option>
          {product_status.map((s) => (
            <option key={s.status} value={s.status}>
              {s.label}
            </option>
          ))}
        </select>

        <input type="file" onChange={(e) => {
          const file = e.target.files?.[0] || null;
          set_image_file(file);
        }}/>

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

export default function Products_page() {
  const [products, set_products] = useState([]);
  const [selected_product, set_selected_product] = useState(null);
  const [is_modal_open, set_is_modal_open] = useState(false);
  const [columnas, set_columnas] = useState(3);
  const [search_text, set_search_text] = useState("");
  const {user} = useAuth();
  const { showAlert } = useAlerts();

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


    try {
      if (data.product_id) {
        const res = await update_products(data.product_id, data.product_name, data.description, data.supplier_id, data.cost_price, data.sale_price, data.current_stock, data.min_stock, data.status, data.image_url, data.department_id);
        showAlert("Producto actualizado correctamente.", "success")
      }
        else {
        const res = await insert_into_products(data.product_name, data.description, data.supplier_id, data.cost_price, data.sale_price, 0, data.min_stock, data.status, data.image_url, data.department_id);
        const res2 = await insert_inventory_movement(res.product_id, user.user_id, "ENTRADA", data.current_stock)
        showAlert("Producto agregado correctamente.", "success");
      }

      await load_products();

    } catch (err) {
      if (err.message.includes("duplicate key value")) {
        showAlert("El producto ya existe en la base de datos.", "error")
      } else {
        console.log(err.message)
      }
    }
  }

  const filtered_products = products.filter((product) =>
    (product.product_name || "")
      .toLowerCase()
      .includes(search_text.trim().toLowerCase())
  );


  return (
    <div className="page-shell page-container">
      <div className="page-hero page-header-admin">
        <div>
          <span>Administración</span>
          <h1>Productos</h1>
          <p>Gestiona los productos, precios, inventario y estado del catálogo.</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            set_selected_product(null);
            set_is_modal_open(true);
          }}
        >
          <span>
            <PlusSquareIcon size={18} />
            Agregar Producto
          </span>
        </button>
      </div>

      <div className="admin-products-toolbar">
        <label className="admin-products-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Buscar producto por nombre"
            value={search_text}
            onChange={(event) => set_search_text(event.target.value)}
          />
        </label>

        <div className="products-column-control admin-products-column-control" aria-label="Columnas de productos">
          {[1, 2, 3, 4].map((cantidad) => (
            <button
              key={cantidad}
              type="button"
              className={columnas === cantidad ? "active" : ""}
              onClick={() => set_columnas(cantidad)}
              aria-pressed={columnas === cantidad}
            >
              {cantidad}
            </button>
          ))}
        </div>
      </div>

      <Product_List
        products={filtered_products}
        columnas={columnas}
        emptyText={
          search_text.trim()
            ? "No encontramos productos con ese nombre."
            : "Cargando Productos..."
        }
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
