import { useState, useEffect } from "react";
import { get_customers } from "../authentication/db_functions";
import {
  User
} from "lucide-react";

function Customer_card({ customer, on_edit }) {

  const date_time_display = (value) => {
    const original = new Date(value);
    return new Intl.DateTimeFormat('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(original);
  };

  return (
    <div className="surface-card interactive-card product-card">

      <div className="product-image">
        {customer.image_url ? (
          <img src={customer.image_url} alt={customer.full_name} loading="lazy"/>
        ) : (
          <span><User size={60}></User></span>
        )}
      </div>

      <p className="product-info">
        <strong>Cliente ID: </strong> {customer.customer_id}
      </p>

      <p className="product-info">
        <strong>ID Interno: </strong> {customer.user_id}
      </p>

      <p className="product-info">
        <strong>Nombre: </strong> {customer.full_name}
      </p>

      <p className="product-info">
        <strong>Telefono: </strong> {customer.phone}
      </p>

      <p className="product-info">
        <strong>Correo: </strong> {customer.email}
      </p>

      <p className="product-info">
        <strong>Correo Interno: </strong> {customer.internal_email}
      </p>

      <p className="product-info">
        <strong>Dirección: </strong> {customer.address}
      </p>

      <p className="product-info">
        <strong>Ultima Sesion: </strong> {date_time_display(customer.last_login)}
      </p>
    </div>
  );
}

function Customer_List({ customers, on_edit }) {
  if (!customers.length) return <p>Cargando Clientes...</p>;

  return (
    <div className="responsive-grid product-grid products-grid">
      {customers.map(customer => (
        <Customer_card
          key={customer.customer_id}
          customer={customer}
          on_edit={on_edit}
        />
      ))}
    </div>
  );
}


export default function Customer_page() {
  const [customers, set_customers] = useState([]);

  const load_customers = async () => {
    try {
      const data = await get_customers();
      set_customers(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    load_customers();
  }, []);


  return (
    <div className="page-shell page-container">

      <div className="page-hero page-header-admin">
        <div>
          <span>Administración</span>
          <h1>Clientes</h1>
          <p>Consulta los datos de clientes registrados y su actividad reciente.</p>
        </div>
      </div>

      <Customer_List
        customers={customers}
      />
      
    </div>
  );
}
