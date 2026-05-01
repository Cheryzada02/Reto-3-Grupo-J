import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, AlertCircle } from "lucide-react";

import {
  insert_into_user_profile,
  login_user_profile,
} from "../authentication/db_functions";

export default function Registro() {
  const navigate = useNavigate();

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setResult("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const fullName = formData.get("full_name")?.trim();
    const username = formData.get("email")?.trim();
    const password = formData.get("password");
    const confirmPassword = formData.get("confirm_password");

    if (password !== confirmPassword) {
      setResult("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setResult("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    const email = `${username}@ferreteriaelupina.com`;

    try {
      await insert_into_user_profile(fullName, email, password, 3);

      const loggedUser = await login_user_profile(email, password);

      if (!loggedUser) {
        setResult("Cuenta creada, pero no se pudo iniciar sesión.");
        return;
      }

      const session = {
        role_id: loggedUser.role_id,
        email,
        user_id: loggedUser.user_id,
        user_name: loggedUser.user_name,
      };

      localStorage.setItem("session", JSON.stringify(session));

      navigate("/");
      window.location.reload();
    } catch (err) {
      if (err.message.includes("duplicate key value")) {
        setResult("Este usuario ya existe.");
      } else {
        setResult("Error al registrar usuario.");
      }

      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-header">
          <span className="login-icon">
            <User size={28} />
          </span>

          <h1>Crear cuenta</h1>

          <p>
            Regístrate para poder realizar compras en Ferretería Elupina.
          </p>
        </div>

        <form onSubmit={handleRegister} className="login-form">
          <div className="login-group">
            <label>Nombre completo</label>

            <div className="login-input-wrapper">
              <User size={18} />
              <input
                type="text"
                name="full_name"
                placeholder="Tu nombre completo"
                required
              />
            </div>
          </div>

          <div className="login-group">
            <label>Usuario</label>

            <div className="login-input-wrapper">
              <User size={18} />
              <input
                type="text"
                name="email"
                placeholder="Nombre de usuario"
                required
              />
              <span>@ferreteriaelupina.com</span>
            </div>
          </div>

          <div className="login-group">
            <label>Contraseña</label>

            <div className="login-input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                name="password"
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>
          </div>

          <div className="login-group">
            <label>Confirmar contraseña</label>

            <div className="login-input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                name="confirm_password"
                placeholder="Repite tu contraseña"
                required
              />
            </div>
          </div>

          {result && (
            <div className="login-message">
              <AlertCircle size={18} />
              <span>{result}</span>
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>
      </section>
    </main>
  );
}