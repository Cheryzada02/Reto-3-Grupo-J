export default function App() {
  const usuario = {
    nombre: "Juan Pérez",
    correo: "juan@email.com",
    role: "Administrador",

    // Correo de alertas
    alertas: "alertas@email.com",

    // Foto de perfil
    foto:
      "https://i.pravatar.cc/150?img=12",
  };

  // Función editar
  const editarPerfil = () => {
    alert("Editar perfil");
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>Mi Perfil</h2>

        <button style={styles.boton}>
          Información Usuario
        </button>
      </div>

      {/* Contenido */}
      <div style={styles.content}>
        <div style={styles.card}>
          <h1>Información del Usuario</h1>

          {/* Foto Perfil */}
          <div style={styles.fotoContainer}>
            <img
              src={usuario.foto}
              alt="Foto de perfil"
              style={styles.foto}
            />
          </div>

          <div style={styles.info}>
            <strong>Nombre:</strong>
            <p>{usuario.nombre}</p>
          </div>

          <div style={styles.info}>
            <strong>Correo:</strong>
            <p>{usuario.correo}</p>
          </div>

          <div style={styles.info}>
            <strong>Rol:</strong>

            <p
              style={{
                color:
                  usuario.role === "Administrador"
                    ? "red"
                    : "green",
                fontWeight: "bold",
              }}
            >
              {usuario.role}
            </p>
          </div>

          {/* Correo Alertas */}
          <div style={styles.info}>
            <strong>Correo de Alertas:</strong>
            <p>{usuario.alertas}</p>
          </div>

          {/* Botón Editar */}
          <button
            style={styles.editarBtn}
            onClick={editarPerfil}
          >
            Editar Perfil
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
  },

  sidebar: {
    width: "250px",
    backgroundColor: "#1e293b",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    marginBottom: "20px",
  },

  boton: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  content: {
    flex: 1,
    padding: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "15px",
    width: "500px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },

  fotoContainer: {
    marginTop: "20px",
    marginBottom: "20px",
  },

  foto: {
    width: "130px",
    height: "130px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #2563eb",
  },

  info: {
    marginTop: "20px",
    fontSize: "18px",
  },

  editarBtn: {
    marginTop: "30px",
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};