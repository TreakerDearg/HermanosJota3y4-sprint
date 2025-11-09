import PropTypes from "prop-types";
import "../styles/components/Destacados.css";

// 🔹 URL base del backend (sin barra final)
const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

function Destacados({ productos = [], verDetalle = () => {}, agregarAlCarrito = () => {} }) {
  const productosDestacados = productos.filter((p) => p.destacado);

  const formatPrecio = (precio) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(precio || 0);

  return (
    <section className="destacados-terminal" aria-labelledby="destacados-titulo">
      <header className="destacados-header">
        <h2 id="destacados-titulo" className="destacados-title">
          Productos Destacados
        </h2>
        <p className="destacados-subtitle">
          Elegidos por nuestros clientes por su calidad y diseño superior.
        </p>
      </header>

      <div className="productos-grid-terminal">
        {productosDestacados.length > 0 ? (
          productosDestacados.map((producto) => {
            const nombre = producto.nombre || "Producto";
            const descripcion = producto.descripcion || "";
            const precio = producto.precio || 0;

            // 🔹 Corrige URL de imagen para producción y desarrollo
            const imagenUrl =
              producto.imagenUrl?.startsWith("/uploads")
                ? `${API_BASE}${producto.imagenUrl}`
                : producto.imagenUrl || "/images/placeholder.png";

            return (
              <article
                key={producto._id}
                className="producto-card-terminal"
                tabIndex={0}
                aria-label={`Producto destacado: ${nombre}`}
              >
                <div className="flip-card-inner-terminal">
                  {/* --- Cara Frontal --- */}
                  <div className="flip-card-front-terminal">
                    <figure className="producto-imagen-terminal">
                      <img
                        src={imagenUrl}
                        alt={`Imagen de ${nombre}`}
                        loading="lazy"
                        draggable={false}
                      />
                    </figure>
                    <div className="producto-info-terminal">
                      <h3 className="producto-nombre-terminal">{nombre}</h3>
                    </div>
                  </div>

                  {/* --- Cara Trasera --- */}
                  <div className="flip-card-back-terminal">
                    <div className="producto-detalle-terminal">
                      <h4 className="precio-terminal">{formatPrecio(precio)}</h4>
                      <p className="mini-desc-terminal">{descripcion}</p>

                      <ul
                        className="benefits-icons-terminal"
                        aria-label="Beneficios del producto"
                      >
                        <li className="benefit-terminal" title="Envío gratis">
                          <i className="fas fa-truck" aria-hidden="true"></i>
                          <span>Envío gratis</span>
                        </li>
                        <li className="benefit-terminal" title="3 cuotas sin interés">
                          <i className="fas fa-credit-card" aria-hidden="true"></i>
                          <span>3 cuotas sin interés</span>
                        </li>
                        <li className="benefit-terminal" title="Garantía 1 año">
                          <i className="fas fa-tools" aria-hidden="true"></i>
                          <span>Garantía 1 año</span>
                        </li>
                      </ul>

                      <div className="destacados-actions-terminal">
                        <button
                          type="button"
                          className="btn-detalle-terminal"
                          onClick={() => verDetalle(producto)}
                          aria-label={`Ver detalles del producto ${nombre}`}
                        >
                          🔍 Ver Detalle
                        </button>
                        <button
                          type="button"
                          className="btn-agregar-terminal"
                          onClick={() => agregarAlCarrito(producto)}
                          aria-label={`Agregar ${nombre} al carrito`}
                        >
                          🛒 Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <p className="no-productos-terminal">
            No hay productos destacados disponibles.
          </p>
        )}
      </div>
    </section>
  );
}

Destacados.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nombre: PropTypes.string,
      descripcion: PropTypes.string,
      precio: PropTypes.number,
      imagenUrl: PropTypes.string,
      destacado: PropTypes.bool,
    })
  ),
  verDetalle: PropTypes.func,
  agregarAlCarrito: PropTypes.func,
};

export default Destacados;
