import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/components/ProductCard.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ProductCard({ producto, agregarAlCarrito, verDetalle }) {
  const [added, setAdded] = useState(false);

  // Navegar al detalle
  const handleClickCard = () => {
    if (verDetalle) verDetalle(producto);
  };

  // Agregar al carrito con feedback
  const handleAgregarAlCarrito = (e) => {
    e.stopPropagation(); // Evita navegar al detalle
    if (agregarAlCarrito) agregarAlCarrito(producto);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <div
      className="producto-card"
      role="button"
      tabIndex={0}
      onClick={handleClickCard}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClickCard();
      }}
      aria-label={`Ver detalles de ${producto.nombre}`}
    >
      <div className="producto-imagen">
        <img
          src={producto.imagen ? `${API_URL}${producto.imagen}` : "/images/placeholder.png"}
          alt={producto.nombre || "Producto"}
          className="producto-img"
          loading="lazy"
        />
      </div>

      <div className="producto-info">
        <span className="producto-categoria">{producto.categoria || "Sin categoría"}</span>
        <h3 className="producto-nombre">{producto.nombre || "Producto"}</h3>
        <p className="producto-precio">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
          }).format(producto.precio || 0)}
        </p>

        {agregarAlCarrito && (
          <button
            className={`add-to-cart-btn ${added ? "added" : ""}`}
            onClick={handleAgregarAlCarrito}
            aria-label={added ? `${producto.nombre} agregado` : `Agregar ${producto.nombre} al carrito`}
          >
            {added ? "✔ Agregado" : "🛒 Agregar al carrito"}
          </button>
        )}
      </div>
    </div>
  );
}

// ===== PropTypes =====
ProductCard.propTypes = {
  producto: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nombre: PropTypes.string,
    precio: PropTypes.number,
    categoria: PropTypes.string,
    imagen: PropTypes.string,
  }).isRequired,
  agregarAlCarrito: PropTypes.func,
  verDetalle: PropTypes.func,
};

export default ProductCard;
