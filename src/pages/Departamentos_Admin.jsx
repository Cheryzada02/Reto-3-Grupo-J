import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Layers } from "lucide-react";

const departamentosIniciales = [
  "Pisos y Terminaciones",
  "Automotriz",
  "Baños y Grifería",
  "Cerrajería",
  "Electricidad",
  "Herramientas",
  "Iluminación",
  "Herrería",
  "Hogar y decoración",
  "Jardinería",
  "Maquinarias",
  "Materiales de construcción",
  "Pinturas",
  "Plomería",
  "Seguridad industrial",
  "Tornillos",
  "Ventilación",
];

export default function DepartamentosAdmin() {
  const [departamentos, setDepartamentos] = useState(
    departamentosIniciales.map((nombre, index) => ({
      id: index + 1,
      nombre,
      estado: "Activo",
    }))
  );

  const [nuevoDepartamento, setNuevoDepartamento] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");

  const agregarDepartamento = () => {
    const nombre = nuevoDepartamento.trim();

    if (!nombre) return;

    const nuevo = {
      id: Date.now(),
      nombre,
      estado: "Activo",
    };

    setDepartamentos((prev) => [...prev, nuevo]);
    setNuevoDepartamento("");
  };

  const iniciarEdicion = (departamento) => {
    setEditandoId(departamento.id);
    setNombreEditado(departamento.nombre);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setNombreEditado("");
  };

  const guardarEdicion = (id) => {
    const nombre = nombreEditado.trim();

    if (!nombre) return;

    setDepartamentos((prev) =>
      prev.map((departamento) =>
        departamento.id === id
          ? { ...departamento, nombre }
          : departamento
      )
    );

    cancelarEdicion();
  };

  const eliminarDepartamento = (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este departamento?"
    );

    if (!confirmar) return;

    setDepartamentos((prev) =>
      prev.filter((departamento) => departamento.id !== id)
    );
  };

  return (
    <main className="departamentos-admin-page">
      <section className="departamentos-admin-header">
        <div>
          <span>Administración</span>
          <h1>Departamentos</h1>
          <p>
            Gestiona las categorías principales que se mostrarán en la tienda.
          </p>
        </div>

        <div className="departamentos-admin-icon">
          <Layers size={36} />
        </div>
      </section>

      <section className="departamentos-admin-panel">
        <div className="departamentos-admin-add">
          <input
            type="text"
            placeholder="Nombre del nuevo departamento"
            value={nuevoDepartamento}
            onChange={(e) => setNuevoDepartamento(e.target.value)}
          />

          <button type="button" onClick={agregarDepartamento}>
            <Plus size={18} />
            Agregar
          </button>
        </div>

        <div className="departamentos-admin-table">
          <div className="departamentos-admin-row departamentos-admin-row-head">
            <span>ID</span>
            <span>Nombre</span>
            <span>Estado</span>
            <span>Acciones</span>
          </div>

          {departamentos.map((departamento) => (
            <div className="departamentos-admin-row" key={departamento.id}>
              <span>{departamento.id}</span>

              <span>
                {editandoId === departamento.id ? (
                  <input
                    type="text"
                    value={nombreEditado}
                    onChange={(e) => setNombreEditado(e.target.value)}
                  />
                ) : (
                  departamento.nombre
                )}
              </span>

              <span className="departamentos-admin-status">
                {departamento.estado}
              </span>

              <span className="departamentos-admin-actions">
                {editandoId === departamento.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => guardarEdicion(departamento.id)}
                    >
                      <Save size={16} />
                    </button>

                    <button type="button" onClick={cancelarEdicion}>
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => iniciarEdicion(departamento)}
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className="departamentos-admin-delete"
                      onClick={() => eliminarDepartamento(departamento.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}