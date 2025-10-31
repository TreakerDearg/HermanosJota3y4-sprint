// src/App.js
import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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

import "./styles/App.css";

// ===== Configuración API =====
// Netlify usa REACT_APP_*
const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://hermanosjota3y4-sprint.onrender.com/api";

function App() {
  // ===== Estado global =====
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [carrito, setCarrito] = useState(() => {
    try {
      const saved = localStorage.getItem("carrito");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [modalCarrito, setModalCarrito] = useState(false);

  // ===== Persistencia carrito =====
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // ===== Hook para fetch productos =====
  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/productos`);
      if (!res.ok) throw new Error("Error al cargar los productos");
      const data = await res.json();
      setProductos(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Error desconocido");
      setProductos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  // ===== Carrito =====
  const agregarAlCarrito = useCallback((producto) => {
    if (!producto) return;
    setCarrito((prev) => {
      const exists = prev.find((p) => p._id === producto._id);
      if (exists) {
        return prev.map((p) =>
          p._id === producto._id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  }, []);

  const eliminarProductoCarrito = useCallback((id) => {
    setCarrito((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const vaciarCarrito = useCallback(() => setCarrito([]), []);
  const toggleModalCarrito = useCallback(() => setModalCarrito((prev) => !prev), []);

  // ===== Construir FormData =====
  const buildFormData = (producto) => {
    const fd = new FormData();
    if (producto instanceof FormData) return producto;

    if (producto.nombre) fd.append("nombre", producto.nombre.trim());
    if (producto.descripcion) fd.append("descripcion", producto.descripcion?.trim() || "");
    if (producto.precio !== undefined) fd.append("precio", String(producto.precio));
    if (producto.stock !== undefined) fd.append("stock", String(producto.stock));
    if (producto.categoria) fd.append("categoria", producto.categoria.trim());
    fd.append("destacado", producto.destacado ? "true" : "false");
    if (producto.imagen) fd.append("imagen", producto.imagen);

    return fd;
  };

  // ===== Crear producto =====
  const crearProducto = async (nuevoProducto) => {
    try {
      const res = await fetch(`${API_BASE}/productos`, {
        method: "POST",
        body: buildFormData(nuevoProducto),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al crear producto");
      await fetchProductos();
      return data;
    } catch (err) {
      console.error("Error en crearProducto:", err);
      throw err;
    }
  };

  // ===== Actualizar producto =====
  const actualizarProducto = async (id, updates) => {
    if (!id) throw new Error("ID de producto inválido");
    try {
      const res = await fetch(`${API_BASE}/productos/${id}`, {
        method: "PUT",
        body: buildFormData(updates),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al actualizar producto");

      await fetchProductos();
      return data;
    } catch (err) {
      console.error("Error en actualizarProducto:", err);
      throw err;
    }
  };

  // ===== Eliminar producto =====
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estás seguro que querés eliminar este producto?")) return;
    try {
      const res = await fetch(`${API_BASE}/productos/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.mensaje || "Error al eliminar producto");
      await fetchProductos();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          carritoCount={carrito.reduce((acc, p) => acc + (p.cantidad || 1), 0)}
          mostrarCarrito={toggleModalCarrito}
        />

        {modalCarrito && (
          <ModalCarrito
            carrito={carrito}
            cerrarModal={toggleModalCarrito}
            eliminarProducto={eliminarProductoCarrito}
            vaciarCarrito={vaciarCarrito}
            finalizarCompra={() => {
              alert("¡Compra realizada con éxito!");
              vaciarCarrito();
            }}
          />
        )}

        <Routes>
          {/* Frontend */}
          <Route
            path="/"
            element={<Home productos={productos} loading={loading} error={error} agregarAlCarrito={agregarAlCarrito} />}
          />
          <Route
            path="/productos/:id?"
            element={<Catalogo productos={productos} loading={loading} error={error} agregarAlCarrito={agregarAlCarrito} />}
          />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/checkout" element={<CheckoutPage carrito={carrito} vaciarCarrito={vaciarCarrito} />} />

          {/* Admin */}
          <Route path="/admin/crear-producto" element={<CrearProducto crearProducto={crearProducto} />} />
          <Route path="/admin/editar-producto/:id" element={<EditarProducto actualizarProducto={actualizarProducto} />} />
          <Route path="/admin/eliminar-producto" element={<EliminarProducto productos={productos} eliminarProducto={eliminarProducto} />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
