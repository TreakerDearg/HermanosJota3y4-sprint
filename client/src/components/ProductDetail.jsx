import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/components/ProductDetail.css";

const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/api$/, "") ||
  "https://hermanosjota3y4-sprint.onrender.com";

function ProductDetail({ producto, agregarAlCarrito, volver }) {
  const [added, setAdded] = useState(false);

  const imagenUrl = producto.imagenUrl
    ? producto.imagenUrl.replace(/\\/g, "/").startsWith("/uploads")
      ? `${API_BASE}${producto.imagenUrl.replace(/\\/g, "/")}`
      : producto.imagenUrl
    : "/images/placeholder.png";

  const handleAgregar = () => {
    if (agregarAlCarrito) agregarAlCarrito(producto);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  const beneficios = producto.beneficios || [
    { icon: "fas fa-truck", text: "Envío gratis" },
    { icon: "fas fa-credit-card", text: "3 cuotas sin interés" },
    { icon: "fas fa-tools", text: "Garantía 1 año" },
  ];

  return (
    <section className="product-detail-terminal" aria-label={`Detalle de ${producto.nombre || "Producto"}`}>
      <div className="detail-terminal-container">
        {/* Imagen del producto */}
        <div className="detail-terminal-imagen">
          <img src={imagenUrl} alt={producto.nombre || "Producto"} loading="lazy" draggable={false} />
        </div>

        {/* Información principal */}
        <div className="detail-terminal-info">
          <h2 className="detail-terminal-title">{producto.nombre || "Producto sin nombre"}</h2>

          <p className="detail-terminal-price">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
            }).format(producto.precio || 0)}
          </p>

          {/* Descripción con scroll si es larga */}
          <div className="detail-terminal-desc-scroll">
            <p className="detail-terminal-desc">{producto.descripcion || "Sin descripción disponible."}</p>
          </div>

          {/* Beneficios tipo panel */}
          <ul className="detail-terminal-benefits" aria-label="Beneficios del producto">
            {beneficios.map((b, idx) => (
              <li key={idx} className="benefit-terminal-item">
                <i className={b.icon} aria-hidden="true"></i>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>

          {/* Botones estilo terminal */}
          <div className="detail-terminal-buttons">
            <button
              className={`btn-terminal-agregar ${added ? "added" : ""}`}
              onClick={handleAgregar}
              aria-label={added ? `${producto.nombre || "Producto"} agregado` : `Añadir ${producto.nombre || "Producto"} al carrito`}
            >
              {added ? "✔ Agregado" : "🛒 Añadir al Carrito"}
            </button>
            <button className="btn-terminal-volver" onClick={volver} aria-label="Volver al catálogo">
              🔙 Volver al Catálogo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

ProductDetail.propTypes = {
  producto: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nombre: PropTypes.string,
    precio: PropTypes.number,
    descripcion: PropTypes.string,
    imagenUrl: PropTypes.string,
    beneficios: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
      })
    ),
  }).isRequired,
  agregarAlCarrito: PropTypes.func,
  volver: PropTypes.func.isRequired,
};

export default ProductDetail;
