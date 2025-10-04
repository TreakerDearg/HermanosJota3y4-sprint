import { useState } from "react";
import "../styles/components/Navbar.css";
import logo from "../assets/logo.png";

function Navbar({ carritoCount, mostrarCarrito, cambiarVista }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const handleClick = (vista) => {
    cambiarVista(vista);
    setMenuAbierto(false); // Cierra el menú al seleccionar
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo" onClick={() => handleClick("inicio")}>
        <img src={logo} alt="Logo Mueblería Hermanos Jota" />
        <span>Hermanos Jota</span>
      </div>

      {/* Botón hamburguesa */}
      <div 
        className={`hamburger ${menuAbierto ? "active" : ""}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menú de navegación */}
      <ul className={`nav-links ${menuAbierto ? "active" : ""}`}>
        <li onClick={() => handleClick("inicio")}>Inicio</li>
        <li onClick={() => handleClick("catalogo")}>Catálogo</li>
        <li onClick={() => handleClick("contacto")}>Contacto</li>
        <li onClick={() => handleClick("checkout")}>Checkout</li>
      </ul>

      {/* Botón de carrito */}
      <button className="carrito-btn" onClick={mostrarCarrito}>
        <span className="cart-icon">🛒</span>
        <span className="cart-count">{carritoCount}</span>
      </button>
    </nav>
  );
}

export default Navbar;
