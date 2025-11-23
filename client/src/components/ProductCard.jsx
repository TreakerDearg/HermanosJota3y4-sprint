import React, { useState, memo } from "react";
import PropTypes from "prop-types";
import { getImagenUrl } from "../utils/getImagenUrl";
import "../styles/components/ProductCard.css";

function ProductCard({ producto, agregarAlCarrito, verDetalle }) {
  const [added, setAdded] = useState(false);

  // LOG completo del producto
  console.log("🧩 PRODUCTO RECIBIDO EN CARD:", producto);

  // URL calculada
  const rawUrl = getImagenUrl(producto);
  console.log("🔍 URL devuelta por getImagenUrl:", rawUrl);

  // URL final (con fallback)
  const imagenUrl = rawUrl || "/images/placeholder.png";
  console.log("🖼️ URL FINAL USADA EN IMG:", imagenUrl);


  const handleClickCard = () => {
    console.log("🖱️ Click en card del producto:", producto?.nombre);
    if (verDetalle) verDetalle(producto);
  };

  const handleAgregar = (e) => {
    e.stopPropagation();
    console.log("🛒 Agregando al carrito:", producto?.nombre);

    if (agregarAlCarrito) {
      agregarAlCarrito(producto);
      setAdded(true);
      setTimeout(() => setAdded(false), 1000);
    }
  };


  return (
    <div className="producto-card-terminal" onClick={handleClickCard}>
      <div className="terminal-border">
        <div className="terminal-header">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>

        <div className="producto-terminal-content">
          
          {/* IMAGEN */}
          <div className="producto-terminal-imagen">
            <img
              src={imagenUrl}
              alt={producto?.nombre || "Producto"}
              draggable="false"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                console.error("❌ ERROR cargando imagen:", imagenUrl);
                console.log("👉 Reemplazada por placeholder");
                e.target.src = "/images/placeholder.png";
              }}
            />
          </div>

          {/* INFORMACIÓN */}
          <div className="producto-terminal-info">
            <h3>{producto?.nombre || "Producto"}</h3>

            <span className="categoria">
              [{producto?.categoria || "Sin categoría"}]
            </span>

            <p className="precio">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              }).format(producto?.precio || 0)}
            </p>

            {/* BOTÓN AGREGAR */}
            {agregarAlCarrito && (
              <button
                className={`terminal-btn ${added ? "added" : ""}`}
                onClick={handleAgregar}
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
  producto: PropTypes.object.isRequired,
  agregarAlCarrito: PropTypes.func,
  verDetalle: PropTypes.func,
};

export default memo(ProductCard);
