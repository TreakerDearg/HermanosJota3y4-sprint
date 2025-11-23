import React, { useState, memo } from "react";
import PropTypes from "prop-types";
import { getImagenUrl } from "../utils/getImagenUrl";
import "../styles/components/ProductCard.css";

function ProductCard({ producto, agregarAlCarrito, verDetalle }) {
  const [added, setAdded] = useState(false);

  const imagenUrl = getImagenUrl(producto) || "/images/placeholder.png";

  const handleClickCard = () => {
    if (verDetalle) verDetalle(producto);
  };

  const handleAgregar = (e) => {
    e.stopPropagation();
    if (agregarAlCarrito) {
      agregarAlCarrito(producto);
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    }
  };

  return (
    <div className="producto-card" onClick={handleClickCard}>
      <div className="card-header">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
      </div>

      <div className="card-body">
        <div className="card-image">
          <img
            src={imagenUrl}
            alt={producto?.nombre || "Producto"}
            loading="lazy"
            onError={(e) => { e.target.src = "/images/placeholder.png"; }}
          />
        </div>

        <div className="card-info">
          <h3>{producto?.nombre || "Producto"}</h3>
          <span className="categoria">{producto?.categoria || "Sin categoría"}</span>
          <p className="precio">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
            }).format(producto?.precio || 0)}
          </p>
          {agregarAlCarrito && (
            <button
              className={`card-btn ${added ? "added" : ""}`}
              onClick={handleAgregar}
            >
              {added ? "✔ AGREGADO" : "AGREGAR AL CARRITO"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  producto: PropTypes.object.isRequired,
  agregarAlCarrito: PropTypes.func,
  verDetalle: PropTypes.func,
};

export default memo(ProductCard);
