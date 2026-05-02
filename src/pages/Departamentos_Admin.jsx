import { useState } from "react";
import { PlusSquare, Pencil, Save, X } from "lucide-react";

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
  const [departamentosAdminLista, setDepartamentosAdminLista] = useState(
    departamentosIniciales.map((nombreDepartamento, index) => ({
      id: index + 1,
      nombre: nombreDepartamento,
      estado: "Activo",
    }))
  );

  const [modalDepartamentoAdminAbierto, setModalDepartamentoAdminAbierto] =
    useState(false);

  const [departamentoAdminEditando, setDepartamentoAdminEditando] =
    useState(null);

  const [formularioDepartamentoAdmin, setFormularioDepartamentoAdmin] =
    useState({
      nombre: "",
      estado: "Activo",
    });

  const normalizarNombreDepartamentoAdmin = (nombreDepartamento) => {
    return nombreDepartamento.trim();
  };

  const existeDepartamentoAdminDuplicado = (
    nombreDepartamento,
    idDepartamentoIgnorado = null
  ) => {
    const nombreNormalizado = nombreDepartamento.toLowerCase();

    return departamentosAdminLista.some((departamento) => {
      const esMismoNombre =
        departamento.nombre.trim().toLowerCase() === nombreNormalizado;

      const esDepartamentoIgnorado =
        departamento.id === idDepartamentoIgnorado;

      return esMismoNombre && !esDepartamentoIgnorado;
    });
  };

  const abrirModalParaCrearDepartamentoAdmin = () => {
    setDepartamentoAdminEditando(null);
    setFormularioDepartamentoAdmin({
      nombre: "",
      estado: "Activo",
    });
    setModalDepartamentoAdminAbierto(true);
  };

  const abrirModalParaEditarDepartamentoAdmin = (departamento) => {
    setDepartamentoAdminEditando(departamento);
    setFormularioDepartamentoAdmin({
      nombre: departamento.nombre,
      estado: departamento.estado,
    });
    setModalDepartamentoAdminAbierto(true);
  };

  const cerrarModalDepartamentoAdmin = () => {
    setModalDepartamentoAdminAbierto(false);
    setDepartamentoAdminEditando(null);
    setFormularioDepartamentoAdmin({
      nombre: "",
      estado: "Activo",
    });
  };

  const actualizarCampoFormularioDepartamentoAdmin = (evento) => {
    const { name, value } = evento.target;

    setFormularioDepartamentoAdmin((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }));
  };

  const crearDepartamentoAdmin = () => {
    const nombreDepartamento = normalizarNombreDepartamentoAdmin(
      formularioDepartamentoAdmin.nombre
    );

    if (!nombreDepartamento) {
      alert("El nombre del departamento no puede estar vacío.");
      return;
    }

    if (existeDepartamentoAdminDuplicado(nombreDepartamento)) {
      alert("Ya existe un departamento con ese nombre.");
      return;
    }

    const nuevoDepartamento = {
      id: Date.now(),
      nombre: nombreDepartamento,
      estado: formularioDepartamentoAdmin.estado,
    };

    setDepartamentosAdminLista((departamentosActuales) => [
      ...departamentosActuales,
      nuevoDepartamento,
    ]);

    cerrarModalDepartamentoAdmin();
  };

  const actualizarDepartamentoAdmin = () => {
    const nombreDepartamento = normalizarNombreDepartamentoAdmin(
      formularioDepartamentoAdmin.nombre
    );

    if (!nombreDepartamento) {
      alert("El nombre del departamento no puede estar vacío.");
      return;
    }

    if (
      existeDepartamentoAdminDuplicado(
        nombreDepartamento,
        departamentoAdminEditando.id
      )
    ) {
      alert("Ya existe otro departamento con ese nombre.");
      return;
    }

    setDepartamentosAdminLista((departamentosActuales) =>
      departamentosActuales.map((departamento) =>
        departamento.id === departamentoAdminEditando.id
          ? {
              ...departamento,
              nombre: nombreDepartamento,
              estado: formularioDepartamentoAdmin.estado,
            }
          : departamento
      )
    );

    cerrarModalDepartamentoAdmin();
  };

  const guardarDepartamentoAdmin = (evento) => {
    evento.preventDefault();

    if (departamentoAdminEditando) {
      actualizarDepartamentoAdmin();
      return;
    }

    crearDepartamentoAdmin();
  };

  return (
    <main className="departamentos-admin-page">
      <div className="page-header-admin">
        <h1>Departamentos</h1>

        <button
          type="button"
          className="btn-agregar"
          onClick={abrirModalParaCrearDepartamentoAdmin}
        >
          <span>
            <PlusSquare size={19} />
            Agregar Departamento
          </span>
        </button>
      </div>

      <section className="departamentos-admin-grid">
        {departamentosAdminLista.map((departamento) => (
          <article className="departamento-admin-card" key={departamento.id}>
            <h2>
              Nombre: <span>{departamento.nombre}</span>
            </h2>

            <p>
              <strong>Estado:</strong> {departamento.estado}
            </p>

            <button
              type="button"
              className="btn"
              onClick={() => abrirModalParaEditarDepartamentoAdmin(departamento)}
            >
              <span>
                <Pencil size={19} />
                Editar
              </span>
            </button>
          </article>
        ))}
      </section>

      {modalDepartamentoAdminAbierto && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {departamentoAdminEditando
                  ? "Editar Departamento"
                  : "Agregar Departamento"}
              </h2>

              <button
                type="button"
                className="modal-close"
                onClick={cerrarModalDepartamentoAdmin}
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>
            </div>

            <form className="modal-form" onSubmit={guardarDepartamentoAdmin}>
              <label>
                Nombre
                <input
                  type="text"
                  name="nombre"
                  value={formularioDepartamentoAdmin.nombre}
                  onChange={actualizarCampoFormularioDepartamentoAdmin}
                  placeholder="Nombre del departamento"
                />
              </label>

              <label>
                Estado
                <select
                  name="estado"
                  value={formularioDepartamentoAdmin.estado}
                  onChange={actualizarCampoFormularioDepartamentoAdmin}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </label>

              <div className="modal-actions">
                <button type="submit" className="btn">
                  <span>
                    <Save size={18} />
                    Guardar
                  </span>
                </button>

                <button
                  type="button"
                  className="btn btn-cancelar"
                  onClick={cerrarModalDepartamentoAdmin}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
