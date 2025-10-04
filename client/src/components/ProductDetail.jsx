import "../styles/components/ProductDetail.css";

function ProductDetail({ producto, agregarAlCarrito, volver }) {
  return (
    <section className="product-detail">
      <div className="detail-container">
        {/* Imagen del producto desde backend */}
        <div className="detail-imagen">
          <img 
            src={`http://localhost:5000${producto.imagen}`} 
            alt={producto.nombre} 
            loading="lazy"
          />
        </div>

        {/* Información principal */}
        <div className="detail-info">
          <h1 className="detail-title">{producto.nombre}</h1>

          {/* Precio con badge */}
          <div className="detail-price-tag">
            <span className="detail-price">${producto.precio.toLocaleString()}</span>
          </div>

          {/* Descripción */}
          <p className="detail-desc">{producto.descripcion}</p>

          {/* Beneficios destacados (opcional, si tienes datos) */}
          {producto.beneficios && (
            <ul className="detail-benefits">
              {producto.beneficios.map((b, idx) => (
                <li key={idx} className="benefit-item">
                  <i className={b.icon}></i> {b.text}
                </li>
              ))}
            </ul>
          )}

          {/* Botones de acción */}
          <div className="detail-buttons">
            <button 
              className="btn-agregar"
              onClick={() => agregarAlCarrito(producto)}
            >
               Añadir al Carrito
            </button>
            <button 
              className="btn-volver"
              onClick={volver}
            >
               Volver al Catálogo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
