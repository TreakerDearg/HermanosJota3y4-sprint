import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/components/Navbar.css";
import logo from "../assets/logo.png";

function Navbar({ carritoCount = 0, mostrarCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [adminAbierto, setAdminAbierto] = useState(false);
  const menuRef = useRef(null);
  const adminRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false);
      if (adminRef.current && !adminRef.current.contains(e.target)) setAdminAbierto(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cerrar menú con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setMenuAbierto(false);
        setAdminAbierto(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClick = (ruta) => {
    navigate(ruta);
    setMenuAbierto(false);
    setAdminAbierto(false);
  };

  const isActive = (ruta) => location.pathname === ruta;

  return (
    <nav className="navbar" role="navigation" aria-label="Menú principal">
      {/* Logo */}
      <div
        className="navbar-logo"
        onClick={() => handleClick("/")}
        role="button"
        tabIndex={0}
        aria-label="Ir a la página de inicio"
        onKeyDown={(e) => { if (e.key === "Enter") handleClick("/"); }}
      >
        <img src={logo} alt="Logo Mueblería Hermanos Jota" />
        <span>Hermanos Jota</span>
      </div>

      {/* Botón hamburguesa */}
      <button
        className={`hamburger ${menuAbierto ? "active" : ""}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuAbierto}
        aria-controls="menu-principal"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menú principal */}
      <ul
        id="menu-principal"
        className={`nav-links ${menuAbierto ? "active" : ""}`}
        ref={menuRef}
      >
        {[
          { name: "Inicio", path: "/" },
          { name: "Catálogo", path: "/productos" },
          { name: "Contacto", path: "/contacto" },
          { name: "Checkout", path: "/checkout" },
        ].map((item) => (
          <li
            key={item.path}
            className={isActive(item.path) ? "active" : ""}
            onClick={() => handleClick(item.path)}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") handleClick(item.path); }}
            aria-current={isActive(item.path) ? "page" : undefined}
          >
            {item.name}
          </li>
        ))}

        {/* Dropdown Admin */}
        <li className="dropdown" ref={adminRef}>
          <span
            onClick={() => setAdminAbierto(!adminAbierto)}
            className="dropdown-title"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") setAdminAbierto(!adminAbierto); }}
            aria-haspopup="true"
            aria-expanded={adminAbierto}
          >
            Admin ▾
          </span>
          {adminAbierto && (
            <ul className="dropdown-menu">
              <li onClick={() => handleClick("/admin/crear-producto")}>Crear Producto</li>
              <li onClick={() => handleClick("/admin/editar-producto/68fa45148a5aea03ee696d6b")}>Editar Producto</li>
              <li onClick={() => handleClick("/admin/eliminar-producto")}>Eliminar Producto</li>
            </ul>
          )}
        </li>
      </ul>

      {/* Carrito */}
      <button
        className="carrito-btn"
        onClick={mostrarCarrito}
        aria-label={`Abrir carrito, ${carritoCount} productos`}
      >
        <span className="cart-icon">🛒</span>
        {carritoCount > 0 && <span className="cart-count">{carritoCount}</span>}
      </button>
    </nav>
  );
}

export default Navbar;
