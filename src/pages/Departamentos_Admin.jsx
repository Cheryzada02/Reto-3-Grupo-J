import { get_departments, insert_into_departments, update_departments} from "../authentication/db_functions";
import { useState, useEffect } from "react";
import { upload_image } from "../authentication/db_functions";
import { delete_image } from "../authentication/db_functions";
import { useAuth } from  "../context/AuthContext";
import { useAlerts } from "../context/AlertContext";
import { PencilIcon, PlusSquareIcon } from "lucide-react";

function Department_card({ department, on_edit }) {

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP"
    }).format(value);
  };


  return ( 

    <div className="surface-card interactive-card product-card">
      <div className="product-image">
        {department.department_url ? (
          <img src={department.department_url} alt={department.name} loading="lazy"/>
        ) : (
          <span>📦</span>
        )}
      </div>

      <p className="product-title">{department.department_name}</p>

      <div className="product-actions">
        <button className="btn" onClick={() => on_edit(department)}>
          <span>
            <PencilIcon size={18} />
            Editar
          </span>
        </button>
      </div>
    </div>

  );
}


function Department_List ({departments, on_edit }) {
  if (!departments.length) return <p>Cargando Departmentos...</p>;

  return (
    <div className="responsive-grid client-products-grid">
      {departments.map(department => (
        <Department_card
          key={department.department_id}
          department={department}
          on_edit={on_edit}
        />
      ))}
    </div>
  );
}

function Department_Form({ department, on_save, on_close }) {
  const { showAlert } = useAlerts();

  const [form, set_form] = useState({
    department_name: "",
    department_url: ""
  });

  const [loading, set_loading] = useState(false)
  const [suppliers, set_suppliers] = useState([]);
  const [departments, set_departments] = useState([]);
  const [department_status, set_status] = useState([]);
  const [image_file, set_image_file] = useState(null);


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
    if (department) {
      set_form(department);
    }
  }, [department]);


  const handle_change = (e) => {
    const { name, value } = e.target;
    set_form(prev => ({
      ...prev,
      [name]: value
    }));

  };

  const handle_submit = async () => {
    if (!form.department_name.trim()) return showAlert("Nombre Es Requerido", "error");

    try {
      set_loading(true);

      let department_url = form.department_url;

      if (image_file) {
        department_url = await upload_image(image_file, 'Department');

        if (form.department_url) {
          await delete_image(form.department_url);
        }
      }

      const final_form = {
        ...form,
        department_url
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
        <h2>{department ? "Editar Departmento" : "Nuevo Departmento"}</h2>

        <input name="department_name" placeholder="Nombre" value={form.department_name} onChange={handle_change} />

        <input type="file" onChange={(e) => {
          const file = e.target.files?.[0] || null;
          set_image_file(file);
        }}/>

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

export default function Departments_page() {
  const [departments, set_departments] = useState([]);
  const [selected_department, set_selected_department] = useState(null);
  const [is_modal_open, set_is_modal_open] = useState(false);
  const {user} = useAuth();
  const { showAlert } = useAlerts();

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

  const save_department = async (data) => {


    try {
      if (data.department_id) {
        const res = await update_departments(data.department_id, data.department_name, data.department_url);
        showAlert("Department Updated Sucessfully!", "success")
      }
        else {
        const res = await insert_into_departments(data.department_name, data.department_url);
        showAlert("Department Added Successfully!", "success");
      }

      await load_departments();

    } catch (err) {
      if (err.message.includes("duplicate key value")) {
        showAlert("Department Already Exists In the Database", "error")
      } else {
        console.log(err.message)
      }
    }
  }


  return (
    <div className="page-shell page-container">
      <div className="page-hero page-header-admin">
        <div>
          <span>Administración</span>
          <h1>Departmentos</h1>
          <p>Organiza las áreas del catálogo y sus imágenes visibles para clientes.</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            set_selected_department(null);
            set_is_modal_open(true);
          }}
        >
          <span>
            <PlusSquareIcon size={18} />
            Agregar Departmento
          </span>
        </button>
      </div>

      <Department_List
        departments={departments}
        on_edit={(department) => {
          set_selected_department(department);
          set_is_modal_open(true);
        }}
      />

      {is_modal_open && (
        <Department_Form
          department={selected_department}
          on_save={save_department}
          on_close={() => set_is_modal_open(false)}
        />
      )}
    </div>
  );
}
