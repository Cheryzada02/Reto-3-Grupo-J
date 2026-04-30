import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Navbar_Admin from "./components/Navbar_Admin";

import Home from "./pages/Home";
import CustomerService from "./pages/CustomerService";
import SupplierPage from "./pages/Suppliers_Admin";
import ProductsPage from "./pages/Products_Admin";
import ProductosPagina from "./pages/Productos";
import Inventory_movements from "./pages/Inventory_Movements_Admin";
import Login from "./pages/Login";
import FAQ from "./pages/FAQ";

import { useAuth } from "./authentication/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {user?.role_id === 1 ? (
        <>
          <Navbar_Admin />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<ProductsPage />} />
            <Route path="/suplidores" element={<SupplierPage />} />
            <Route path="/inventory_movements" element={<Inventory_movements />} />
            <Route path="/servicio-cliente" element={<CustomerService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </>
      ) : (
        <>
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/servicio-cliente" element={<CustomerService />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/productos" element={<ProductosPagina />} />
            <Route path="/productoscliente" element={<ProductosPagina />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;