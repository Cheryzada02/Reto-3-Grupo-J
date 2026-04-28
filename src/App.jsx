import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CustomerService from "./pages/CustomerService";
import SupplierPage from "./components/Testing_Supplier";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicio-cliente" element={<CustomerService />} />
        <Route path="/suplidores" element={<SupplierPage />} />
      </Routes>
    </>
  );
}

export default App;
