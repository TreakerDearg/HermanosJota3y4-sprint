import { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ModalCarrito from "./components/ModalCarrito";
import EliminarProducto from "./pages/EliminarProducto";


import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";
import CheckoutPage from "./pages/Checkout";

import "./styles/App.css";

function App() {
  // ===== Estado global =====
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem("carrito");
    return saved ? JSON.parse(saved) : [];
  });
  const [modalCarrito, setModalCarrito] = useState(false);

  // ===== Persistencia carrito =====
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // ===== Fetch productos desde API =====
  useEffect(() => {
    const controller = new AbortController();

    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5000/api/productos", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Error al cargar los productos");
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
    return () => controller.abort();
  }, []);

  // ===== Funciones de carrito =====
  const agregarAlCarrito = useCallback((producto) => {
    if (!producto) return;
    setCarrito((prev) => [...prev, producto]);
  }, []);

  const eliminarProducto = useCallback((id) => {
    setCarrito((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const vaciarCarrito = useCallback(() => setCarrito([]), []);
  const mostrarCarrito = useCallback(() => setModalCarrito((prev) => !prev), []);


  return (
    <Router>
      <div className="App">
        <Navbar carritoCount={carrito.length} mostrarCarrito={mostrarCarrito} />

        {modalCarrito && (
          <ModalCarrito
            carrito={carrito}
            cerrarModal={mostrarCarrito}
            eliminarProducto={eliminarProducto}
            vaciarCarrito={vaciarCarrito}
          />
        )}

        <Routes>
          <Route path="/" element={<Home productos={productos} loading={loading} error={error} />} />
          <Route
            path="/productos/:id?"
            element={
              <Catalogo
                productos={productos}
                loading={loading}
                error={error}
                agregarAlCarrito={agregarAlCarrito}
              />
            }
          />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/checkout" element={<CheckoutPage carrito={carrito} vaciarCarrito={vaciarCarrito} />} />
          <Route path="/eliminar-producto" element={<EliminarProducto />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
