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
import Inventory_movements from "./pages/Inventory_Movements_Admin";
import { useAuth } from  "./authentication/AuthContext";

function App() {

  const { user } = useAuth();

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
            <Route path="/inventory_movements" element={<Inventory_movements />} />
            <Route path="/servicio-cliente" element={<CustomerService />} />
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


