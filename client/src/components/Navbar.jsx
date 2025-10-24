import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/Navbar.css";
import logo from "../assets/logo.png";

function Navbar({ carritoCount = 0, mostrarCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const handleClick = (ruta) => {
    navigate(ruta);
    setMenuAbierto(false); // Cierra el menú al seleccionar
  };


  return (
    <nav className="navbar" role="navigation" aria-label="Menú principal">
      {/* Logo */}
      <div
        className="navbar-logo"
        onClick={() => handleClick("/")}
        role="button"
        tabIndex={0}
        aria-label="Ir a la página de inicio"
      >
        <img src={logo} alt="Logo Mueblería Hermanos Jota" />
        <span>Hermanos Jota</span>
      </div>

      {/* Botón hamburguesa */}
      <button
        className={`hamburger ${menuAbierto ? "active" : ""}`}
        onClick={toggleMenu}
        aria-label="Abrir/Cerrar menú"
        aria-expanded={menuAbierto}
        aria-controls="menu-principal"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menú de navegación */}
      <ul
        id="menu-principal"
        className={`nav-links ${menuAbierto ? "active" : ""}`}
      >
        <li onClick={() => handleClick("/")}>Inicio</li>
        <li onClick={() => handleClick("/productos")}>Catálogo</li>
        <li onClick={() => handleClick("/contacto")}>Contacto</li>
        <li onClick={() => handleClick("/checkout")}>Checkout</li>
      </ul>

      {/* Botón de carrito */}
      <button
        className="carrito-btn"
        onClick={mostrarCarrito}
        aria-label={`Abrir carrito, ${carritoCount} productos`}
      >
        <span className="cart-icon">🛒</span>
        <span className="cart-count">{carritoCount}</span>
      </button>
    </nav>
  );
}

export default Navbar;
