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

  // 🔹 Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false);
      if (adminRef.current && !adminRef.current.contains(e.target)) setAdminAbierto(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Cerrar con Escape
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
    <nav className="navbar-terminal">
      {/* 🔹 Logo */}
      <div
        className="navbar-logo"
        onClick={() => handleClick("/")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleClick("/")}
      >
        <img src={logo} alt="Logo Mueblería Hermanos Jota" />
        <span className="logo-text">Hermanos Jota</span>
      </div>

      {/* 🔹 Menú principal */}
      <ul className={`nav-links ${menuAbierto ? "active" : ""}`} ref={menuRef}>
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
            onKeyDown={(e) => e.key === "Enter" && handleClick(item.path)}
          >
            {item.name}
          </li>
        ))}

        {/* 🔹 Dropdown Admin */}
        <li className="dropdown" ref={adminRef}>
          <span
            className="dropdown-title"
            onClick={() => setAdminAbierto(!adminAbierto)}
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

      {/* 🔹 Botón Carrito */}
      <button className="carrito-btn" onClick={mostrarCarrito}>
        <span className="cart-icon">🛒</span>
        {carritoCount > 0 && <span className="cart-count">{carritoCount}</span>}
      </button>

      {/* 🔹 Hamburguesa */}
      <button
        className={`hamburger ${menuAbierto ? "active" : ""}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}

export default Navbar;
