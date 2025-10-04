import "../styles/components/ProductDetail.css";

function ProductDetail({ producto = {}, agregarAlCarrito, volver }) {
  // Desestructuramos con valores por defecto para evitar errores
  const {
    nombre = "Producto sin nombre",
    descripcion = "Sin descripción disponible",
    precio = 0,
    imagen = "", 
    beneficios = []
  } = producto;

  return (
    <section className="product-detail">
      <div className="detail-container">
        {/* Imagen del producto */}
        <div className="detail-imagen">
          {imagen ? (
            <img src={imagen} alt={nombre} />
          ) : (
            <span role="img" aria-label={nombre}>🪑</span>
          )}
        </div>

        {/* Información principal */}
        <div className="detail-info">
          <h1 className="detail-title">{nombre}</h1>

          {/* Precio */}
          <div className="detail-price-tag">
            <span className="detail-price">${precio}</span>
          </div>

          {/* Descripción */}
          <p className="detail-desc">{descripcion}</p>

          {/* Beneficios destacados */}
          {beneficios.length > 0 && (
            <ul className="detail-benefits">
              {beneficios.map((b, idx) => (
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
