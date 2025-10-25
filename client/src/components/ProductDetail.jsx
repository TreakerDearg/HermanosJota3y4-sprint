import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/components/ProductDetail.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ProductDetail({ producto, agregarAlCarrito, volver }) {
  const [added, setAdded] = useState(false);

  // URL de imagen segura
  const imagenUrl = producto.imagenUrl
    ? producto.imagenUrl.startsWith("/uploads")
      ? `${API_URL}${producto.imagenUrl}`
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
    <section className="product-detail" aria-label={`Detalle de ${producto.nombre || "Producto"}`}>
      <div className="detail-container">
        {/* Imagen del producto */}
        <div className="detail-imagen">
          <img
            src={imagenUrl}
            alt={producto.nombre || "Producto"}
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Información principal */}
        <div className="detail-info">
          <h2 className="detail-title">{producto.nombre || "Producto sin nombre"}</h2>

          <div className="detail-price-tag">
            <span className="detail-price">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              }).format(producto.precio || 0)}
            </span>
          </div>

          <p className="detail-desc">{producto.descripcion || "Sin descripción disponible."}</p>

          <ul className="detail-benefits" aria-label="Beneficios del producto">
            {beneficios.map((b, idx) => (
              <li key={idx} className="benefit-item">
                <i className={b.icon} aria-hidden="true"></i> {b.text}
              </li>
            ))}
          </ul>

          <div className="detail-buttons">
            <button
              className={`btn-agregar ${added ? "added" : ""}`}
              onClick={handleAgregar}
              aria-label={added ? `${producto.nombre || "Producto"} agregado` : `Añadir ${producto.nombre || "Producto"} al carrito`}
            >
              {added ? "✔ Agregado" : "🛒 Añadir al Carrito"}
            </button>
            <button
              className="btn-volver"
              onClick={volver}
              aria-label="Volver al catálogo"
            >
              🔙 Volver al Catálogo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== PropTypes =====
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
