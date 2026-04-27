import { useState, useEffect } from 'react'
import { login_user_profile } from '../authentication/db_functions'

export default function User_form() {

  const [result, set_result] = useState(null)
  const [loading, set_loading] = useState(false)
  
  const capturar_boton_login = async (e) => {
    e.preventDefault();

    set_loading(true)

    const form_data = new FormData(e.currentTarget);
    const user_name = form_data.get("email")

    const user_data = {
      email: `${user_name}@ferreteriard.com`,
      password: form_data.get('password')
    }
  
    try {
      const res = await login_user_profile(user_data.email, user_data.password)

      if (res) {
        set_result('Login Sucessfull!!')
      }
      else {
        set_result('Credenciales Incorrectas')
      }
    } catch (err) {
      if (err.message.includes("duplicate key value")) {
        set_result("Usuario Registrado")
      } else {
        set_result(err.message)
      }
    } finally {
      set_loading(false)
    }
    
  }

  return (
    <div className="form-container">
      <div className="form-title">Iniciar Sesion</div>

      <form onSubmit={capturar_boton_login}>

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
          {loading ? "Logging..." : "Submit"}
        </button>

        <label className='center_labeled'> {result}</label>
      </form>
    </div>

  );
}