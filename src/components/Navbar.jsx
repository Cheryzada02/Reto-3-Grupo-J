import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">FerreteriaRD</div>

      <Link to="/login"> <button>Login</button></Link>

      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/servicio-cliente">Servicio al Cliente</Link>
        <Link to="/productos">Productos</Link>
        <Link to="/productoscliente">Productos</Link>
      </nav>
    </header>
  );
}