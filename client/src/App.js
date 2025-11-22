// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";



import { UIProvider, useUI } from "./context/UIContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ModalCarrito from "./components/ModalCarrito";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import CheckoutPage from "./pages/Checkout";
import CrearProducto from "./pages/CrearProducto";
import EditarProducto from "./pages/EditarProducto";
import EliminarProducto from "./pages/EliminarProducto";
import AuthPage from "./pages/AuthPage";
import UserProfile from "./pages/UserProfile";
import EditProfile from "./pages/EditProfile";
import EditPassword from "./pages/EditPassword";
import MetodosPago from "./pages/MetodosPago";
import Direcciones from "./pages/Direcciones";
import Notificaciones from "./pages/Notificaciones";
import Actividad from "./pages/Actividad";
import ProductosAdmin from "./pages/ProductosAdmin";



import "./styles/App.css";

// ============================================
// 🚦 Rutas privadas
// ============================================
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.rol === "admin" ? children : <Navigate to="/" />;
};

// ============================================
// 🌐 Contenido principal de la app
// ============================================
function AppContent() {
  const { modalCarrito, toggleModalCarrito } = useUI();

  return (
    <>
      <Navbar mostrarCarrito={toggleModalCarrito} />
      {modalCarrito && <ModalCarrito />}
<Routes>
  {/* Páginas públicas */}
  <Route path="/" element={<Home />} />
  <Route path="/productos" element={<Catalogo />} />
  <Route path="/productos/:id" element={<Catalogo />} />
  <Route path="/contacto" element={<Contacto />} />
  <Route path="/auth" element={<AuthPage />} />
  <Route path="/metodos-pago" element={<MetodosPago />} />
  <Route path="/direcciones" element={<Direcciones />} />
  <Route path="/notificaciones" element={<Notificaciones />} />
  <Route path="/actividad" element={<Actividad />} />

  {/* Perfil del usuario */}
  <Route
    path="/perfil"
    element={
      <PrivateRoute>
        <UserProfile />
      </PrivateRoute>
    }
  />
  <Route
    path="/checkout"
    element={
      <PrivateRoute>
        <CheckoutPage />
      </PrivateRoute>
    }
  />
  <Route
    path="/editar-perfil"
    element={
      <PrivateRoute>
        <EditProfile />
      </PrivateRoute>
    }
  />
  <Route
    path="/editar-password"
    element={
      <PrivateRoute>
        <EditPassword />
      </PrivateRoute>
    }
  />

  {/* Rutas de administración */}
  <Route
    path="/admin/crear-producto"
    element={
      <AdminRoute>
        <CrearProducto />
      </AdminRoute>
    }
  />
  <Route
    path="/admin/editar-producto/:id"
    element={
      <AdminRoute>
        <EditarProducto />
      </AdminRoute>
    }
  />
  <Route
    path="/admin/eliminar-producto"
    element={
      <AdminRoute>
        <EliminarProducto />
      </AdminRoute>
    }
  />
  <Route
    path="/admin/productos"
    element={
      <AdminRoute>
        <ProductosAdmin />
      </AdminRoute>
    }
  />
</Routes>


      <Footer />
    </>
  );
}

// ============================================
// 🔹 App principal con Providers
// ============================================
export default function App() {
  return (
    <Router>
      <AuthProvider>
        <UIProvider>
          <ProductProvider>

            <CartProvider>
              <AppContent />
            </CartProvider>
          </ProductProvider>

        </UIProvider>
      </AuthProvider>
    </Router>
  );
}
