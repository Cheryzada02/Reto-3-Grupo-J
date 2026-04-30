import { useState, useEffect } from 'react'
import { insert_into_user_profile } from '../authentication/db_functions'

export default function Registro() {

  const [result, set_result] = useState(null)
  const [loading, set_loading] = useState(false)
  
  const capturar_boton_registro = async (e) => {
    e.preventDefault();

    set_loading(true)

    const form_data = new FormData(e.currentTarget);
    const user_name = form_data.get("email")

    const user_data = {
      full_name: form_data.get('full_name'),
      email: `${user_name}@ferreteriard.com`,
      password: form_data.get('password')
    }
  
    try {
      const res = await insert_into_user_profile(user_data.full_name, user_data.email, user_data.password, 3)
      set_result('Usuario Registrado')
    } catch (err) {
      if (err.message.includes("duplicate key value")) {
        set_result("El Usuario Ya Existe En La Base De Datos.")
      } else {
        set_result(err.message)
      }
    } finally {
      set_loading(false)
    }
  }

  return (
    <div className="form-container">
      <div className="form-title">Create Account</div>

      <form onSubmit={capturar_boton_registro}>
        <div className="form-group">
          <label>Nombre Completo</label>
          <input type="text" name="full_name" required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <div className="input-group">
            <input type="text" name="email" placeholder="Nombre Usuario" required />
            <span className="input-suffix">@ferreteriard.com</span>
          </div>
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" name="password" required />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Cuenta"}
        </button>

        <label className='center_labeled'> {result}</label>
      </form>
    </div>

  );
}