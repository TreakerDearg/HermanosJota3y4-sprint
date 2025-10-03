import { useState } from "react";
import Navbar from "./components/Navbar";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";
import ModalCarrito from "./components/ModalCarrito";

import "./styles/App.css";

function App() {
  const productosMock = [
    { id: 1, nombre: "Silla de madera", precio: 2000, descripcion: "Cómoda y resistente" },
    { id: 2, nombre: "Mesa de comedor", precio: 5000, descripcion: "Madera maciza" },
    { id: 3, nombre: "Estantería", precio: 3500, descripcion: "Perfecta para libros" },
  ];

  const [productos] = useState(productosMock);
  const [carrito, setCarrito] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [vista, setVista] = useState("inicio"); // "inicio", "catalogo", "contacto", "checkout"
  const [modalCarrito, setModalCarrito] = useState(false);

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  // Eliminar un producto específico del carrito
  const eliminarProducto = (index) => {
    const nuevoCarrito = [...carrito];
    nuevoCarrito.splice(index, 1);
    setCarrito(nuevoCarrito);
  };

// Finalizar compra y llevar a checkout
const finalizarCompra = () => {
  setVista("checkout");   // Cambiamos la vista al checkout
  setModalCarrito(false); // Cerramos el modal
};


  // Ver detalle de producto
  const verDetalle = (producto) => {
    setProductoSeleccionado(producto);
  };

  // Volver al catálogo
  const volverAlCatalogo = () => {
    setProductoSeleccionado(null);
  };

  // Cambiar vista principal
  const cambiarVista = (vistaNueva) => {
    setVista(vistaNueva);
    setProductoSeleccionado(null);
  };

  // Mostrar / ocultar modal carrito
  const mostrarCarrito = () => {
    setModalCarrito(!modalCarrito);
  };

  return (
    <div className="App">
      <Navbar 
        carritoCount={carrito.length} 
        mostrarCarrito={mostrarCarrito} 
        cambiarVista={cambiarVista} 
      />

      {/* Modal Carrito */}
      {modalCarrito && (
        <ModalCarrito 
          carrito={carrito} 
          cerrarModal={mostrarCarrito} 
          finalizarCompra={finalizarCompra} 
          eliminarProducto={eliminarProducto}
        />
      )}

      {/* Renderizado condicional según vista */}
      {vista === "inicio" && <h2>Bienvenido a Mueblería Hermanos Jota</h2>}

      {vista === "catalogo" && (
        productoSeleccionado ? (
          <ProductDetail
            producto={productoSeleccionado}
            agregarAlCarrito={agregarAlCarrito}
            volver={volverAlCatalogo}
          />
        ) : (
          <ProductList productos={productos} verDetalle={verDetalle} />
        )
      )}

      {vista === "contacto" && <ContactForm />}

      {vista === "checkout" && (
        <Checkout carrito={carrito} vaciarCarrito={() => setCarrito([])} />
      )}

      <Footer />
    </div>
  );
}

export default App;
