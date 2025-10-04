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

  // ===== Fetch productos =====
  useEffect(() => {
    console.log("[App] Iniciando fetch de productos...");
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5000/api/productos");
        if (!res.ok) throw new Error("Error al cargar los productos");

        const data = await res.json();
        console.log("[App] Datos recibidos del backend:", data);

        if (!Array.isArray(data)) throw new Error("Datos de productos inválidos");

        setProductos(data);
        console.log("[App] Productos seteados correctamente");
      } catch (err) {
        console.error("[App] Error fetchProductos:", err);
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
        console.log("[App] Loading finalizado");
      }
    };

    fetchProductos();
  }, []);

  // ===== Carrito =====
  const agregarAlCarrito = (producto) => {
    if (!producto) return;
    console.log("[App] Agregando al carrito:", producto.nombre);
    setCarrito((prev) => [...prev, producto]);
  };

  const eliminarProducto = (id) => {
   setCarrito((prevCarrito) => {
    // Buscamos la primera coincidencia
    const index = prevCarrito.findIndex(item => item.id === id);
    if (index === -1) return prevCarrito;

    const nuevoCarrito = [...prevCarrito];

    // Si hay más de 1 del mismo producto, eliminamos solo una unidad
    nuevoCarrito.splice(index, 1);

    return nuevoCarrito;
  });
};

  const vaciarCarrito = () => {
    console.log("[App] Vaciando carrito");
    setCarrito([]);
  };

  const finalizarCompra = () => {
    console.log("[App] Finalizando compra");
    setVista("checkout");
    setModalCarrito(false);
  };

  // ===== Navegación =====
  const verDetalle = (producto) => {
    if (!producto) return;
    console.log("[App] Ver detalle de producto:", producto.nombre);
    setProductoSeleccionado(producto);
    setVista("catalogo");
  };

  const volverAlCatalogo = () => {
    console.log("[App] Volviendo al catálogo");
    setProductoSeleccionado(null);
    setVista("catalogo");
  };

  const cambiarVista = (vistaNueva) => {
    console.log("[App] Cambiando vista a:", vistaNueva);
    setVista(vistaNueva);
    setProductoSeleccionado(null);
  };

  const mostrarCarrito = () => {
    console.log("[App] Toggle modal carrito:", !modalCarrito);
    setModalCarrito((prev) => !prev);
  };

  // ===== Render condicional =====
  const renderContenido = () => {
    console.log("[App] Renderizando contenido para vista:", vista);
    if (loading) {
      console.log("[App] Loading activo, mostrando spinner");
      return (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando productos...</p>
        </div>
      );
    }

    if (error) {
      console.log("[App] Error encontrado:", error);
      return (
        <div className="error-msg">
          <p>Error: {error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      );
    }

    const productosArray = Array.isArray(productos) ? productos : [];
    console.log("[App] Productos a renderizar:", productosArray.length);

    switch (vista) {
      case "inicio":
        console.log("[App] Renderizando vista Inicio");
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
        console.log("[App] Renderizando vista Catálogo");
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
        console.log("[App] Renderizando vista Contacto");
        return <ContactForm />;

      case "checkout":
        console.log("[App] Renderizando vista Checkout");
        return <Checkout carrito={carrito} vaciarCarrito={vaciarCarrito} />;

      default:
        console.log("[App] Vista desconocida:", vista);
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
