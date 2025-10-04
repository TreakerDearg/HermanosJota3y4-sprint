import "../styles/components/Footer.css";
import logo from "../assets/logo.png";

function Footer({ cambiarVista }) {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">

        {/* Logo y eslogan */}
        <div className="footer-logo">
          <img src={logo} alt="Logo Mueblería Hermanos Jota" />
          <h2>Mueblería Hermanos Jota</h2>
          <p className="footer-slogan">Los mejores muebles para tu hogar</p>
        </div>

        {/* Links rápidos con navegación interna */}
        <nav className="footer-links" aria-label="Enlaces rápidos">
          <h3>Enlaces</h3>
          <ul>
            <li><button onClick={() => cambiarVista("inicio")}>Inicio</button></li>
            <li><button onClick={() => cambiarVista("catalogo")}>Catálogo</button></li>
            <li><button onClick={() => cambiarVista("contacto")}>Contacto</button></li>
            <li><button onClick={() => cambiarVista("checkout")}>Checkout</button></li>
          </ul>
        </nav>

        {/* Contacto */}
        <div className="footer-contact">
          <h3>Contacto</h3>
          <p>Email: <a href="mailto:info@muebleriajota.com">info@muebleriajota.com</a></p>
          <p>Tel: <a href="tel:+541112345678">+54 11 1234-5678</a></p>
          <p>Dirección: Av. Ejemplo 123, Ciudad, País</p>
        </div>

        {/* Newsletter */}
        <div className="footer-newsletter">
          <h3>Suscríbete</h3>
          <p>Recibe novedades y ofertas exclusivas</p>
          <form onSubmit={(e) => e.preventDefault()} className="newsletter-form">
            <input type="email" placeholder="Tu correo" required />
            <button type="submit">Suscribirse</button>
          </form>
        </div>

        {/* Redes sociales */}
        <div className="footer-socials">
          <h3>Redes Sociales</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Separador y derechos reservados */}
      <hr className="footer-separator" />
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mueblería Hermanos Jota. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
