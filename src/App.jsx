import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Navbar_Admin from "./components/Navbar_Admin";
import Home from "./pages/Home";
import CustomerService from "./pages/CustomerService";
import SupplierPage from "./pages/Suppliers_Admin";
import ProductsPage from "./pages/Products_Admin";
import User_form from "./components/testing2"; 
import { useState, useEffect } from "react";
import ProductosPagina from "./pages/Productos";

function App() {

  const [user, setUser] = useState(null)
  
  useEffect(() => {
  const session = JSON.parse(localStorage.getItem("session"));

  if (session) {
    setUser(session);
  }
}, []);

  return (
    <BrowserRouter>
      {user?.role_id === 1 ? (
        // ADMIN APP
        <>
          <Navbar_Admin />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/suplidores" element={<SupplierPage />} />
            <Route path="/servicio-cliente" element={<CustomerService />} />
            <Route path="/servicio1" element={<CustomerService />} />
            <Route path="/servicio2" element={<CustomerService />} />
            <Route path="/servicio3" element={<CustomerService />} />
            <Route path="/servicio4" element={<CustomerService />} />
          </Routes>
        </>
      ) : (
        // CLIENT APP (default for everyone)
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<User_form />} />
            <Route path="/servicio-cliente" element={<CustomerService />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="*" element={<Home />} />
            <Route path="/productoscliente" element={<ProductosPagina />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;


