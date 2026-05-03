import { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Save,
  ShieldCheck,
  KeyRound,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { update_user_password } from "../authentication/db_functions";

export default function PaginaPerfil() {
  const { user } = useAuth();

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <main className="page-shell perfil-page">
        <section className="surface-card empty-state perfil-empty-card">
          <h1>No has iniciado sesión</h1>
          <p>Debes iniciar sesión para ver tu perfil.</p>
        </section>
      </main>
    );
  }

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    setMessage({ type: "", text: "" });

    if (passwords.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({
        type: "error",
        text: "Las contraseñas no coinciden.",
      });
      return;
    }

    try {
      setLoading(true);

      await update_user_password(user.user_id, passwords.newPassword);

      setMessage({
        type: "success",
        text: "Contraseña actualizada correctamente.",
      });

      setPasswords({
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text: "No se pudo actualizar la contraseña.",
      });
    } finally {
      setLoading(false);
    }
  };

  const roleText =
    user.role_id === 1 ? "Administrador" : "Cliente";

  return (
    <main className="page-shell perfil-page">
      <section className="page-hero perfil-hero">
        <div>
          <span>Cuenta de usuario</span>
          <h1>Mi perfil</h1>
          <p>
            Consulta tu información personal y administra la seguridad de tu
            cuenta.
          </p>
        </div>
      </section>

      <section className="perfil-layout">
        <aside className="surface-card perfil-sidebar">
          <div className="perfil-avatar-box">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Foto de perfil"
              className="perfil-avatar"
            />

            <h2>{user.user_name}</h2>
            <p>{user.email}</p>
          </div>

          <nav className="perfil-menu">
            <button type="button" className="perfil-menu-item active">
              <User size={18} />
              Información personal
            </button>

            <button type="button" className="perfil-menu-item">
              <KeyRound size={18} />
              Seguridad
            </button>
          </nav>
        </aside>

        <section className="perfil-content">
          <article className="surface-card perfil-card">
            <div className="perfil-card-header">
              <div>
                <h2>Información del usuario</h2>
                <p>Estos datos vienen de tu sesión activa.</p>
              </div>

              <ShieldCheck size={28} />
            </div>

            <div className="perfil-info-grid">
              <div className="perfil-info-item">
                <User size={20} />
                <div>
                  <span>Nombre</span>
                  <strong>{user.user_name}</strong>
                </div>
              </div>

              <div className="perfil-info-item">
                <Mail size={20} />
                <div>
                  <span>Correo</span>
                  <strong>{user.email}</strong>
                </div>
              </div>
            </div>
          </article>

          <article className="surface-card perfil-card">
            <div className="perfil-card-header">
              <div>
                <h2>Cambiar contraseña</h2>
                <p>Usa una contraseña segura y fácil de recordar para ti.</p>
              </div>

              <Lock size={28} />
            </div>

            <form
              className="perfil-password-form"
              onSubmit={handleChangePassword}
            >
              <label>
                Nueva contraseña
                <div className="perfil-input-wrapper">
                  <Lock size={18} />
                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={handlePasswordInput}
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
              </label>

              <label>
                Confirmar contraseña
                <div className="perfil-input-wrapper">
                  <Lock size={18} />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwords.confirmPassword}
                    onChange={handlePasswordInput}
                    placeholder="Repite la contraseña"
                    required
                  />
                </div>
              </label>

              {message.text && (
                <p className={`perfil-message ${message.type}`}>
                  {message.text}
                </p>
              )}

              <button
                type="submit"
                className="perfil-save-button"
                disabled={loading}
              >
                <Save size={18} />
                {loading ? "Guardando..." : "Guardar contraseña"}
              </button>
            </form>
          </article>
        </section>
      </section>
    </main>
  );
}
