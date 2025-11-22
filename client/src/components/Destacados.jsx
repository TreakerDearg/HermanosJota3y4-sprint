import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../styles/components/Destacados.css";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

export default function Destacados({ productos = [] }) {
  const navigate = useNavigate();

  const productosDestacados = Array.isArray(productos)
    ? productos.filter((p) => p.destacado)
    : [];

  const handleVerDetalle = (producto) => {
    if (producto?._id) navigate(`/productos/${producto._id}`);
  };

  const handleKeyDown = (e, producto) => {
    if (e.key === "Enter") handleVerDetalle(producto);
  };

  const construirImagenSrc = (producto) => {
    let rawUrl = producto.imagenUrl || producto.imagen || "";
    rawUrl = rawUrl.trim().replace(/\\/g, "/");

    // Si ya es URL absoluta, usarla tal cual
    if (/^https?:\/\//i.test(rawUrl)) {
      return rawUrl;
    }

    // Limpiar /images/ al inicio si existe
    rawUrl = rawUrl.replace(/^\/?images\/?/, "");

    // Si no hay imagen, usar placeholder local
    if (!rawUrl) return "/images/placeholder.png";

    // Evitar doble /uploads
    rawUrl = rawUrl.replace(/^\/?uploads\/?/, "");

    return `${API_BASE.replace(/\/api$/, "")}/uploads/${rawUrl}`;
  };

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
            const { _id, nombre = "Producto", descripcion = "", precio = 0 } = producto;
            const imagenSrc = construirImagenSrc(producto);

            return (
              <article
                key={_id}
                className="producto-card-terminal"
                tabIndex={0}
                role="button"
                aria-label={`Producto destacado: ${nombre}`}
                onClick={() => handleVerDetalle(producto)}
                onKeyDown={(e) => handleKeyDown(e, producto)}
              >
                <div className="flip-card-inner-terminal">
                  <div className="flip-card-front-terminal">
                    <figure className="producto-imagen-terminal">
                      <img
                        src={imagenSrc}
                        alt={`Imagen de ${nombre}`}
                        loading="lazy"
                        draggable={false}
                        onError={(e) => {
                          e.target.src = "/images/placeholder.png";
                        }}
                      />
                    </figure>
                    <div className="producto-info-terminal">
                      <h3 className="producto-nombre-terminal">{nombre}</h3>
                    </div>
                  </div>

                  <div className="flip-card-back-terminal">
                    <div className="producto-detalle-terminal">
                      <h4 className="precio-terminal">
                        {precio.toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 0,
                        })}
                      </h4>
                      <p className="mini-desc-terminal">{descripcion}</p>
                      <p className="click-detalle">Haz click para ver detalle 🡆</p>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <p className="no-productos-terminal">No hay productos destacados disponibles.</p>
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
      imagen: PropTypes.string,
      imagenUrl: PropTypes.string,
      destacado: PropTypes.bool,
    })
  ),
};

Destacados.defaultProps = {
  productos: [],
};
