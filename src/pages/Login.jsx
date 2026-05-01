import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, AlertCircle } from "lucide-react";

import { login_user_profile } from "../authentication/db_functions";

export default function Login() {
  const navigate = useNavigate();

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setResult("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const username = formData.get("email")?.trim();
    const password = formData.get("password");

    const userData = {
      email: `${username}@ferreteriaelupina.com`,
      password,
    };

    try {
      const res = await login_user_profile(userData.email, userData.password);

      if (!res) {
        setResult("Credenciales incorrectas.");
        return;
      }

      const session = {
        role_id: res.role_id,
        email: userData.email,
        user_id: res.user_id,
        user_name: res.user_name,
      };

      localStorage.setItem("session", JSON.stringify(session));

      navigate("/");
      window.location.reload();
    } catch (err) {
      setResult("No se pudo iniciar sesión. Intenta nuevamente.");
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
            <Lock size={28} />
          </span>

          <h1>Iniciar sesión</h1>

          <p>
            Accede con tu usuario empresarial para continuar en Ferretería
            Elupina.
          </p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-group">
            <label htmlFor="email">Usuario</label>

            <div className="login-input-wrapper">
              <User size={18} />
              <input
                id="email"
                type="text"
                name="email"
                placeholder="Nombre de usuario"
                required
              />
              <span>@ferreteriaelupina.com</span>
            </div>
          </div>

          <div className="login-group">
            <label htmlFor="password">Contraseña</label>

            <div className="login-input-wrapper">
              <Lock size={18} />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Tu contraseña"
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
            {loading ? "Validando..." : "Entrar"}
          </button>

          {/* LINK A REGISTRO */}
          <div className="login-footer">
            <a href="/registro" className="login-link">
              ¿No tienes cuenta? Crear cuenta
            </a>
          </div>
        </form>
      </section>
    </main>
  );
}