import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useCart } from "../context/CartContext";
import "../styles/components/ProductDetail.css";

// ============================
// ✅ Configuración de API dinámica
// ============================
const API_BASE = (process.env.REACT_APP_API_URL || "https://hermanosjota3y4-sprint.onrender.com").replace(/\/$/, "");

const ProductDetail = ({ producto, volver }) => {
  const [added, setAdded] = useState(false);
  const { agregarAlCarrito } = useCart();

  // ============================
  // 🔹 Normalización segura de la imagen
  // ============================
  const imagenUrl = useMemo(() => {
    const src = producto.imagenUrl || producto.imagen || "";
    if (!src) return "/images/placeholder.png"; // fallback

    // Si es URL absoluta (Cloudinary u otra) → usar tal cual
    if (src.startsWith("http")) return src;

    // Si es ruta relativa local (uploads/xxx) → agregar API_BASE
    const normalized = src.replace(/\\/g, "/").replace(/^\/?uploads/, "");
    return `${API_BASE}/uploads/${normalized}`;
  }, [producto]);

  // ============================
  // 🔹 Manejo del botón “Agregar al carrito”
  // ============================
  const handleAgregar = () => {
    agregarAlCarrito?.(producto);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  // ============================
  // 🔹 Beneficios por defecto
  // ============================
  const beneficios = useMemo(
    () =>
      producto.beneficios || [
        { icon: "fas fa-truck", text: "Envío gratis" },
        { icon: "fas fa-credit-card", text: "3 cuotas sin interés" },
        { icon: "fas fa-tools", text: "Garantía 1 año" },
      ],
    [producto]
  );

  // ============================
  // 🔹 Renderizado
  // ============================
  return (
    <section className="product-detail-terminal" aria-label={`Detalle de ${producto.nombre || "Producto"}`}>
      <div className="detail-terminal-container">
        {/* Imagen */}
        <div className="detail-terminal-imagen">
          <img
            src={imagenUrl}
            alt={producto.nombre || "Producto"}
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Info principal */}
        <div className="detail-terminal-info">
          <h2 className="detail-terminal-title">{producto.nombre || "Producto sin nombre"}</h2>

          <p className="detail-terminal-price">
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
            }).format(producto.precio || 0)}
          </p>

          <div className="detail-terminal-desc-scroll">
            <p className="detail-terminal-desc">
              {producto.descripcion || "Sin descripción disponible."}
            </p>
          </div>

          <ul className="detail-terminal-benefits" aria-label="Beneficios del producto">
            {beneficios.map((b, idx) => (
              <li key={idx} className="benefit-terminal-item">
                <i className={b.icon} aria-hidden="true"></i>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>

          <div className="detail-terminal-buttons">
            <button
              className={`btn-terminal-agregar ${added ? "added" : ""}`}
              onClick={handleAgregar}
              aria-label={
                added
                  ? `${producto.nombre || "Producto"} agregado`
                  : `Añadir ${producto.nombre || "Producto"} al carrito`
              }
            >
              {added ? "✔ Agregado" : "🛒 Añadir al Carrito"}
            </button>

            <button
              className="btn-terminal-volver"
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
};

ProductDetail.propTypes = {
  producto: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    nombre: PropTypes.string,
    precio: PropTypes.number,
    descripcion: PropTypes.string,
    imagen: PropTypes.string,
    imagenUrl: PropTypes.string,
    beneficios: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string,
        text: PropTypes.string,
      })
    ),
  }).isRequired,
  volver: PropTypes.func.isRequired,
};

export default ProductDetail;
