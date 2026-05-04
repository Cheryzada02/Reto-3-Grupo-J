import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Navbar_Admin from "./components/Navbar_Admin";
import Footer from "./components/Footer";
import Chatbot from "./components/Chatbot";

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
import SobreNosotros from "./pages/SobreNosotros";
import Customer_page from "./pages/Customers_Admin";
import PaginaPerfil from "./pages/PaginaPerfil";
import DepartamentosAdmin from "./pages/Departamentos_Admin";
import SobreNosotrosAdmin from "./pages/SobreNosotros_Admin";
import StockAlertsPage from "./pages/Stock_Alerts";
import PerfilAdmin from "./pages/Perfil_Admin";

import { useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Orders_Page from "./pages/Orders_Admin";
import Orders_detail_Page from "./pages/Orders_Details_Admin";

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
                <Route path="/productos/:id" element={<ProductoDetalle />} />
                <Route path="/departamentos" element={<DepartamentosAdmin />} />
                <Route path="/suplidores" element={<SupplierPage />} />
                <Route path="/inventory_movements" element={<Inventory_movements />}/>
                <Route path="/customers" element={<Customer_page />} />
                <Route path="/orders" element={<Orders_Page />} />
                <Route path="/orders_details" element={<Orders_detail_Page />} />
                <Route path="/stock-alerts" element={<StockAlertsPage />} />
                <Route path="/perfil" element={<PerfilAdmin />} />
                <Route path="/sobre-nosotros" element={<SobreNosotrosAdmin />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="*" element={<Home />} />
              </Routes>

              <Footer />
              <Chatbot />
            </>
          ) : (
            <>
              <Navbar />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/perfil" element={<PaginaPerfil />} />
                <Route path="/servicio-cliente" element={<CustomerService />} />
                <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/productos" element={<ProductosPagina />} />
                <Route path="/productos/:id" element={<ProductoDetalle />} />
                <Route path="/departamentos/:departamentoRuta" element={<ProductosPagina />} />
                <Route path="/carrito" element={<Cart />} />
                <Route path="/favoritos" element={<Favoritos />} />
                <Route path="*" element={<Home />} />
              </Routes>

              <Footer />
              <Chatbot />
            </>
          )}
        </BrowserRouter>
      </FavoritesProvider>
    </CartProvider>
  );
}

export default App;
