export default function User_form({ onSubmit }) {
  return (
    <div className="form-container">
      <div className="form-title">Create Account</div>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Nombre Completo</label>
          <input type="text" name="full_name" required />
        </div>

        <div className="form-group">
          <label>Email - Usuario</label>
          <div className="input-group">
            <input type="text" name="email" placeholder="username" required />
            <span className="input-suffix">@ferreteriard.com</span>
          </div>
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" name="password" required />
        </div>

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}