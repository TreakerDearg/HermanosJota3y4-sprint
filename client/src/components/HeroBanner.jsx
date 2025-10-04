import "../styles/HeroBanner.css";
import logo from "../assets/logo.png";

const HeroBanner = ({ cambiarVista }) => {
  return (
    <section className="hero-banner" aria-label="Sección principal">
      {/* Overlay con efecto degradado */}
      <div className="overlay"></div>

      <div className="hero-container">
        {/* Header con logo y título */}
        <header className="hero-header">
          <img src={logo} alt="Logo Mueblería Hermanos Jota" className="hero-logo" />
          <h1 className="hero-title">Mueblería Hermanos Jota</h1>
          <p className="hero-slogan">Diseño, confort y calidad para tu hogar</p>
        </header>

        {/* Botones principales */}
        <nav className="hero-actions" aria-label="Acciones principales">
          <button 
            className="btn btn-primary" 
            onClick={() => cambiarVista("catalogo")}
            aria-label="Ver catálogo"
          >
            Ver catálogo
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => cambiarVista("contacto")}
            aria-label="Contáctanos"
          >
            Contáctanos
          </button>
        </nav>

        {/* Beneficios destacados */}
        <ul className="hero-benefits" aria-label="Beneficios destacados">
          <li className="benefit">
            <i className="fas fa-truck" aria-hidden="true"></i>
            <span>Envío gratis en compras +$20.000</span>
          </li>
          <li className="benefit">
            <i className="fas fa-credit-card" aria-hidden="true"></i>
            <span>3 cuotas sin interés</span>
          </li>
          <li className="benefit">
            <i className="fas fa-tools" aria-hidden="true"></i>
            <span>Garantía 1 año</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default HeroBanner;
