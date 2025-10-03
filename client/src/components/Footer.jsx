import React from "react";
import "../styles/components/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} Mueblería Hermanos Jota</p>
      <p>Todos los derechos reservados.</p>
      <p>
        Síguenos en:
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer"> Facebook</a> | 
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer"> Instagram</a>
      </p>
    </footer>
  );
}

export default Footer;
