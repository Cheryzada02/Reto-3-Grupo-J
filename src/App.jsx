import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Navbar_Admin from "./components/Navbar_Admin";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import CustomerService from "./pages/CustomerService";
import SupplierPage from "./pages/Suppliers_Admin";
import ProductsPage from "./pages/Products_Admin";
import ProductosPagina from "./pages/Productos";
import ProductoDetalle from "./pages/ProductoDetalle";
import Inventory_movements from "./pages/Inventory_Movements_Admin";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import FAQ from "./pages/FAQ";
import Cart from "./pages/Cart";
import Favoritos from "./pages/Favoritos";

import { useAuth } from "./authentication/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";

function App() {
  const { user } = useAuth();

  return (
    <CartProvider>
      <FavoritesProvider>
        <BrowserRouter>
          {user?.role_id === 1 ? (
            <>
              <Navbar_Admin />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<ProductsPage />} />
                <Route path="/suplidores" element={<SupplierPage />} />
                <Route
                  path="/inventory_movements"
                  element={<Inventory_movements />}
                />
                <Route path="/servicio-cliente" element={<CustomerService />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="*" element={<Home />} />
              </Routes>

              <Footer />
            </>
          ) : (
            <>
              <Navbar />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/servicio-cliente" element={<CustomerService />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/productos" element={<ProductosPagina />} />
                <Route path="/productos/:id" element={<ProductoDetalle />} />
                <Route path="/productoscliente" element={<ProductosPagina />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="*" element={<Home />} />
              </Routes>

              <Footer />
            </>
          )}
        </BrowserRouter>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;