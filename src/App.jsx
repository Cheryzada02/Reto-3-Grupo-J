import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CustomerService from "./pages/CustomerService";
import SupplierPage from "./components/Testing_Supplier";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servicio-cliente" element={<CustomerService />} />
        <Route path="/suplidores" element={<SupplierPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
