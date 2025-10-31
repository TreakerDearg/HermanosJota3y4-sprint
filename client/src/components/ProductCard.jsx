import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/components/ProductCard.css";

const API_BASE =
  process.env.REACT_APP_API_URL?.replace(/\/api$/, "") ||
  "https://hermanosjota3y4-sprint.onrender.com";

function ProductCard({ producto, agregarAlCarrito, verDetalle }) {
  const [added, setAdded] = useState(false);

  const imagenUrl = producto.imagenUrl
    ? producto.imagenUrl.replace(/\\/g, "/").startsWith("/uploads")
      ? `${API_BASE}${producto.imagenUrl.replace(/\\/g, "/")}`
      : producto.imagenUrl
    : "/images/placeholder.png";

  const handleClickCard = () => {
    if (verDetalle) verDetalle(producto);
  };

  const handleAgregarAlCarrito = (e) => {
    e.stopPropagation();
    if (agregarAlCarrito) agregarAlCarrito(producto);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div
      className="producto-card-terminal"
      onClick={handleClickCard}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClickCard();
      }}
    >
      <div className="terminal-border">
        <div className="terminal-header">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>

        <div className="producto-terminal-content">
          <div className="producto-terminal-imagen">
            <img
              src={imagenUrl}
              alt={producto.nombre}
              draggable={false}
              loading="lazy"
            />
          </div>

          <div className="producto-terminal-info">
            <h3>{producto.nombre || "Producto"}</h3>
            <span className="categoria">
              [{producto.categoria || "Sin categoría"}]
            </span>
            <p className="precio">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              }).format(producto.precio || 0)}
            </p>

            {agregarAlCarrito && (
              <button
                className={`terminal-btn ${added ? "added" : ""}`}
                onClick={handleAgregarAlCarrito}
              >
                {added ? "✔ AGREGADO" : "AGREGAR AL CARRITO"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  producto: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nombre: PropTypes.string,
    precio: PropTypes.number,
    categoria: PropTypes.string,
    imagenUrl: PropTypes.string,
  }).isRequired,
  agregarAlCarrito: PropTypes.func,
  verDetalle: PropTypes.func,
};

export default ProductCard;
