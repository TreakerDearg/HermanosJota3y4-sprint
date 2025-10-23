import "../styles/components/ProductDetail.css";

function ProductDetail({ producto, agregarAlCarrito, volver }) {
  // Beneficios predeterminados si no vienen desde el producto
  const beneficios = producto.beneficios || [
    { icon: "fas fa-truck", text: "Envío gratis" },
    { icon: "fas fa-credit-card", text: "3 cuotas sin interés" },
    { icon: "fas fa-tools", text: "Garantía 1 año" },
  ];

  return (
    <section className="product-detail" aria-label={`Detalle de ${producto.nombre}`}>
      <div className="detail-container">
        {/* Imagen del producto */}
        <div className="detail-imagen">
          <img 
            src={producto.imagen ? `http://localhost:5000${producto.imagen}` : "/images/placeholder.png"} 
            alt={producto.nombre || "Producto"} 
            loading="lazy"
          />
        </div>

        {/* Información principal */}
        <div className="detail-info">
          <h2 className="detail-title">{producto.nombre}</h2>

          <div className="detail-price-tag">
            <span className="detail-price">
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              }).format(producto.precio || 0)}
            </span>
          </div>

          <p className="detail-desc">{producto.descripcion}</p>

          <ul className="detail-benefits" aria-label="Beneficios del producto">
            {beneficios.map((b, idx) => (
              <li key={idx} className="benefit-item">
                <i className={b.icon} aria-hidden="true"></i> {b.text}
              </li>
            ))}
          </ul>

          <div className="detail-buttons">
            <button 
              className="btn-agregar"
              onClick={() => agregarAlCarrito(producto)}
              aria-label={`Añadir ${producto.nombre} al carrito`}
            >
              🛒 Añadir al Carrito
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

export default ProductDetail;
