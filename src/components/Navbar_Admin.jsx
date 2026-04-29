import { Link } from "react-router-dom";

export default function Navbar_Admin() {
  return (
    <header className="navbar">
      <div className="logo">FerreteriaRD</div>

      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/servicio-cliente">Servicio al Cliente</Link>
        <Link to="/suplidores">Suplidores</Link>
        <Link to="/productos">Productos</Link>
      </nav>
    </header>
  );
}