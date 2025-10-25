import "../styles/components/Destacados.css";

function Destacados({ productos = [], verDetalle = () => {}, agregarAlCarrito = () => {} }) {
  const productosDestacados = productos.filter((p) => p.destacado);

  const formatPrecio = (precio) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(precio);

  return (
    <section className="destacados" aria-labelledby="destacados-titulo">
      <header className="destacados-header">
        <h2 id="destacados-titulo" className="destacados-title">
          Productos Destacados
        </h2>
        <p className="destacados-subtitle">
          Elegidos por nuestros clientes por su calidad y diseño superior.
        </p>
      </header>

      <div className="productos-grid">
        {productosDestacados.length > 0 ? (
          productosDestacados.map((producto) => {
            const nombre = producto.nombre || "Producto";
            const descripcion = producto.descripcion || "";
            const precio = producto.precio || 0;
            const imagen = producto.imagenUrl || "/images/placeholder.png";

            return (
              <article
                key={producto._id}
                className="producto-card"
                tabIndex={0}
                aria-label={`Producto destacado: ${nombre}`}
              >
                <div className="flip-card-inner">
                  {/* --- Cara Frontal --- */}
                  <div className="flip-card-front">
                    <figure className="producto-imagen">
                      <img src={imagen} alt={`Imagen de ${nombre}`} loading="lazy" draggable="false" />
                    </figure>
                    <div className="producto-info">
                      <h3 className="producto-nombre">{nombre}</h3>
                    </div>
                  </div>

                  {/* --- Cara Trasera --- */}
                  <div className="flip-card-back">
                    <div className="producto-detalle">
                      <h4 className="precio">{formatPrecio(precio)}</h4>
                      <p className="mini-desc">{descripcion}</p>

                      <ul className="benefits-icons" aria-label="Beneficios del producto">
                        <li className="benefit" title="Envío gratis">
                          <i className="fas fa-truck" aria-hidden="true"></i> <span>Envío gratis</span>
                        </li>
                        <li className="benefit" title="3 cuotas sin interés">
                          <i className="fas fa-credit-card" aria-hidden="true"></i> <span>3 cuotas sin interés</span>
                        </li>
                        <li className="benefit" title="Garantía 1 año">
                          <i className="fas fa-tools" aria-hidden="true"></i> <span>Garantía 1 año</span>
                        </li>
                      </ul>

                      <div className="destacados-actions">
                        <button
                          type="button"
                          className="btn-detalle"
                          onClick={() => verDetalle(producto)}
                          aria-label={`Ver detalles del producto ${nombre}`}
                        >
                          🔍 Ver Detalle
                        </button>
                        <button
                          type="button"
                          className="btn-agregar"
                          onClick={() => agregarAlCarrito(producto)}
                          aria-label={`Agregar ${nombre} al carrito`}
                        >
                          🛒 Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <p className="no-productos">No hay productos destacados disponibles.</p>
        )}
      </div>
    </section>
  );
}

export default Destacados;
