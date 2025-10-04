import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";
import ModalCarrito from "./components/ModalCarrito";
import HeroBanner from "./components/HeroBanner";
import Destacados from "./components/Destacados";
import SobreNosotros from "./components/SobreNosotros";
import Newsletter from "./components/Newsletter";
import "./styles/App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [vista, setVista] = useState("inicio");
  const [modalCarrito, setModalCarrito] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5000/api/productos");
        if (!res.ok) throw new Error("Error al cargar los productos");

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Datos de productos inválidos");

        setProductos(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const agregarAlCarrito = (producto) => {
    if (!producto) return;
    setCarrito((prev) => [...prev, producto]);
  };

  const eliminarProducto = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  const vaciarCarrito = () => setCarrito([]);

  const finalizarCompra = () => {
    setVista("checkout");
    setModalCarrito(false);
  };

  const verDetalle = (producto) => {
    if (!producto) return;
    setProductoSeleccionado(producto);
    setVista("catalogo");
  };

  const volverAlCatalogo = () => setProductoSeleccionado(null);

  const cambiarVista = (vistaNueva) => {
    setVista(vistaNueva);
    setProductoSeleccionado(null);
  };

  const mostrarCarrito = () => setModalCarrito((prev) => !prev);

  const renderContenido = () => {
    if (loading)
      return (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      );

    if (error)
      return (
        <div className="error-msg">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      );

    const productosArray = Array.isArray(productos) ? productos : [];

    switch (vista) {
      case "inicio":
        return (
          <>
            <HeroBanner cambiarVista={cambiarVista} />
            <Destacados
              productos={productosArray.filter((p) => p.destacado)}
              verDetalle={verDetalle}
            />
            <SobreNosotros />
            <Newsletter />
          </>
        );

      case "catalogo":
        return productoSeleccionado ? (
          <ProductDetail
            producto={productoSeleccionado}
            agregarAlCarrito={agregarAlCarrito}
            volver={volverAlCatalogo}
          />
        ) : (
          <ProductList productos={productosArray} verDetalle={verDetalle} />
        );

      case "contacto":
        return <ContactForm />;

      case "checkout":
        return <Checkout carrito={carrito} vaciarCarrito={vaciarCarrito} />;

      default:
        return <p className="info-msg">Vista no encontrada</p>;
    }
  };

  return (
    <div className="App">
      <Navbar
        carritoCount={carrito.length}
        mostrarCarrito={mostrarCarrito}
        cambiarVista={cambiarVista}
      />

      {modalCarrito && (
        <ModalCarrito
          carrito={carrito}
          cerrarModal={mostrarCarrito}
          finalizarCompra={finalizarCompra}
          eliminarProducto={eliminarProducto}
        />
      )}

      {renderContenido()}

      <Footer cambiarVista={cambiarVista} />
    </div>
  );
}

export default App;
