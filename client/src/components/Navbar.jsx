import React from "react";
import "../styles/components/Navbar.css";

function Navbar({ carritoCount, mostrarCarrito, cambiarVista }) {
  return (
    <nav className="navbar">
      {/* Logo */}
      <h1 className="logo" onClick={() => cambiarVista("inicio")}>
        🪑 Hermanos Jota
      </h1>

      {/* Menú de navegación */}
      <ul className="nav-links">
        <li onClick={() => cambiarVista("catalogo")}>Catálogo</li>
        <li onClick={() => cambiarVista("contacto")}>Contacto</li>
        <li onClick={() => cambiarVista("checkout")}>Checkout</li>
      </ul>

      {/* Botón de carrito con emoticono */}
      <button className="carrito-btn" onClick={mostrarCarrito}>
        🛒 {carritoCount}
      </button>
    </nav>
  );
}

export default Navbar;
