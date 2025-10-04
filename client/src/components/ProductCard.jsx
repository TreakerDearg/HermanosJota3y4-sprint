import "../styles/components/ProductCard.css";

function ProductCard({ producto, verDetalle }) {
  return (
    <div className="producto-card">
      <div className="flip-card-inner">
        {/* Cara frontal */}
        <div className="flip-card-front">
          <div className="producto-imagen">
            <span role="img" aria-label={producto.nombre}>🪑</span>
          </div>
          <div className="producto-info">
            <h3>{producto.nombre}</h3>
            <span className="product-category">{producto.categoria}</span>
            <p className="precio">${producto.precio}</p>
          </div>
        </div>

        {/* Cara trasera */}
        <div className="flip-card-back">
          <div className="overlay-content">
            <p className="mini-desc">{producto.descripcion}</p>
            <div className="benefits-icons">
              <div className="benefit" title="Envío gratis">
                <i className="fas fa-truck"></i>
                <span>Envío gratis</span>
              </div>
              <div className="benefit" title="3 cuotas sin interés">
                <i className="fas fa-credit-card"></i>
                <span>3 cuotas sin interés</span>
              </div>
              <div className="benefit" title="Garantía 1 año">
                <i className="fas fa-tools"></i>
                <span>Garantía 1 año</span>
              </div>
            </div>
            <button className="btn-detalle" onClick={() => verDetalle(producto)}>
              🔍 Ver Detalle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
