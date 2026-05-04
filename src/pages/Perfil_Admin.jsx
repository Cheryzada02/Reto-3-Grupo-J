import { useEffect, useState } from "react";
import { Edit, KeyRound, Mail, Save, User, X } from "lucide-react";

import {
  get_user_profile,
  update_user_password,
  update_user_profiles,
} from "../authentication/db_functions";
import { useAuth } from "../context/AuthContext";
import { useAlerts } from "../context/AlertContext";

export default function PerfilAdmin() {
  const { user } = useAuth();
  const { showAlert } = useAlerts();
  const [profile, setProfile] = useState(null);
  const [alertsEmail, setAlertsEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user?.user_id) return;

    const loadProfile = async () => {
      try {
        const data = await get_user_profile(user.user_id);
        const nextProfile = Array.isArray(data) ? data[0] : data;

        setProfile(nextProfile);
        setAlertsEmail(nextProfile?.alerts_email || "");
      } catch (error) {
        console.error(error);
        showAlert("No se pudo cargar el perfil administrador.", "error");
      }
    };

    loadProfile();
  }, [showAlert, user?.user_id]);

  const saveAlertsEmail = async () => {
    if (!alertsEmail.includes("@")) {
      showAlert("Correo de alertas inválido.", "error");
      return;
    }

    try {
      setLoading(true);
      await update_user_profiles(user.user_id, alertsEmail);
      setProfile((prev) => ({ ...prev, alerts_email: alertsEmail }));
      setIsEditing(false);
      showAlert("Correo de alertas actualizado.", "success");
    } catch (error) {
      console.error(error);
      showAlert("No se pudo actualizar el correo de alertas.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (passwords.newPassword.length < 6) {
      showAlert("La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      showAlert("Las contraseñas no coinciden.", "error");
      return;
    }

    try {
      setLoading(true);
      await update_user_password(user.user_id, passwords.newPassword);
      setPasswords({ newPassword: "", confirmPassword: "" });
      showAlert("Contraseña actualizada correctamente.", "success");
    } catch (error) {
      console.error(error);
      showAlert("No se pudo actualizar la contraseña.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell perfil-page">
      <section className="page-hero perfil-hero">
        <div>
          <span>Cuenta administrador</span>
          <h1>Mi perfil</h1>
          <p>Administra tu información de alertas y seguridad.</p>
        </div>
      </section>

      <section className="perfil-content perfil-admin-content">
        <article className="surface-card perfil-card">
          <div className="perfil-card-header">
            <div>
              <h2>Información del administrador</h2>
              <p>Datos principales de tu usuario administrador.</p>
            </div>

            {isEditing ? (
              <div className="perfil-card-actions">
                <button type="button" onClick={saveAlertsEmail} disabled={loading}>
                  <Save size={18} />
                  Guardar
                </button>
                <button
                  type="button"
                  className="perfil-cancel-button"
                  onClick={() => {
                    setAlertsEmail(profile?.alerts_email || "");
                    setIsEditing(false);
                  }}
                >
                  <X size={18} />
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="perfil-edit-button"
                onClick={() => setIsEditing(true)}
              >
                <Edit size={18} />
                Editar
              </button>
            )}
          </div>

          <div className="perfil-info-grid">
            <div className="perfil-info-item">
              <User size={20} />
              <div>
                <span>Nombre</span>
                <strong>{profile?.full_name || "Administrador"}</strong>
              </div>
            </div>

            <div className="perfil-info-item">
              <Mail size={20} />
              <div>
                <span>Correo interno</span>
                <strong>{profile?.internal_email || "Sin correo"}</strong>
              </div>
            </div>

            <div className="perfil-info-item">
              <Mail size={20} />
              <div>
                <span>Correo de alertas</span>
                {isEditing ? (
                  <input
                    type="email"
                    value={alertsEmail}
                    onChange={(event) => setAlertsEmail(event.target.value)}
                  />
                ) : (
                  <strong>{profile?.alerts_email || "Sin correo de alertas"}</strong>
                )}
              </div>
            </div>
          </div>
        </article>

        <article className="surface-card perfil-card">
          <div className="perfil-card-header">
            <div>
              <h2>Cambiar contraseña</h2>
              <p>Actualiza la contraseña de tu usuario administrador.</p>
            </div>

            <KeyRound size={28} />
          </div>

          <form className="perfil-password-form" onSubmit={handlePasswordChange}>
            <label>
              Nueva contraseña
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(event) =>
                  setPasswords((prev) => ({
                    ...prev,
                    newPassword: event.target.value,
                  }))
                }
                required
              />
            </label>

            <label>
              Confirmar contraseña
              <input
                type="password"
                value={passwords.confirmPassword}
                onChange={(event) =>
                  setPasswords((prev) => ({
                    ...prev,
                    confirmPassword: event.target.value,
                  }))
                }
                required
              />
            </label>

            <button type="submit" className="perfil-save-button" disabled={loading}>
              <Save size={18} />
              Guardar contraseña
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}
