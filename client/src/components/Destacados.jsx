import "../styles/components/Destacados.css";

function Destacados({ productos, verDetalle }) {
  // Filtrar solo productos destacados
  const productosDestacados = productos.filter((p) => p.destacado);

  return (
    <section className="destacados" aria-label="Productos Destacados">
      <h2 className="destacados-title">Productos Destacados</h2>
      <div className="productos-grid">
        {productosDestacados.map((producto) => (
          <article key={producto.id} className="producto-card">
            <div className="flip-card-inner">

              {/* Cara frontal */}
              <div className="flip-card-front">
                <figure className="producto-imagen">
                  <img
                    src={`http://localhost:5000${producto.imagen}`}
                    alt={producto.nombre}
                    loading="lazy"
                  />
                </figure>
                <div className="producto-info">
                  <h3>{producto.nombre}</h3>
                </div>
              </div>

              {/* Cara trasera */}
              <div className="flip-card-back">
                <div className="overlay-content">
                  <p className="precio">AR$ {producto.precio.toLocaleString()}</p>
                  <p className="mini-desc">{producto.descripcion}</p>

                  <div className="benefits-icons">
                    <div className="benefit" title="Envío gratis">
                      <i className="fas fa-truck" aria-hidden="true"></i>
                      <span>Envío gratis</span>
                    </div>
                    <div className="benefit" title="3 cuotas sin interés">
                      <i className="fas fa-credit-card" aria-hidden="true"></i>
                      <span>3 cuotas sin interés</span>
                    </div>
                    <div className="benefit" title="Garantía 1 año">
                      <i className="fas fa-tools" aria-hidden="true"></i>
                      <span>Garantía 1 año</span>
                    </div>
                  </div>

                  <button
                    className="btn-detalle"
                    onClick={() => verDetalle(producto)}
                    aria-label={`Ver detalle de ${producto.nombre}`}
                  >
                    🔍 Ver Detalle
                  </button>
                </div>
              </div>

            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Destacados;
