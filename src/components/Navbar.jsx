import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">FerreteriaRD</div>

      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/servicio-cliente">Servicio al Cliente</Link>
      </nav>
    </header>
  );
}