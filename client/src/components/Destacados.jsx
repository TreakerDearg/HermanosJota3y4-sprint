import "../styles/components/Destacados.css";

function Destacados({ productos, verDetalle }) {
  // Filtrar solo productos destacados
  const productosDestacados = productos.filter(p => p.destacado);

  return (
    <section className="destacados">
      <h2 className="destacados-title">Productos Destacados</h2>
      <div className="productos-grid">
        {productosDestacados.map((producto) => (
          <div key={producto.id} className="producto-card">
            {/* Contenedor de flip-card */}
            <div className="flip-card-inner">

              {/* Cara frontal */}
              <div className="flip-card-front">
                <div className="producto-imagen">
                  <img 
                    src={`http://localhost:5000${producto.imagen}`} 
                    alt={producto.nombre} 
                    loading="lazy"
                  />
                </div>
                <div className="producto-info">
                  <h3>{producto.nombre}</h3>
                </div>
              </div>

              {/* Cara trasera con overlay */}
              <div className="flip-card-back">
                <div className="overlay-content">
                  <p className="precio">${producto.precio.toLocaleString()}</p>
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

                  <button
                    className="btn-detalle"
                    onClick={() => verDetalle(producto)}
                  >
                    🔍 Ver Detalle
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Destacados;
