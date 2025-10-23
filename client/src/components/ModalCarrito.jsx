import "../styles/components/ModalCarrito.css";

function ModalCarrito({ carrito, cerrarModal, finalizarCompra = () => {}, eliminarProducto }) {
  // Agrupar productos por _id
  const productosAgrupados = carrito.reduce((acc, item) => {
    const key = item._id; // Usamos _id de MongoDB
    if (acc[key]) {
      acc[key].cantidad += 1;
      acc[key].precioTotal += item.precio;
    } else {
      acc[key] = { ...item, cantidad: 1, precioTotal: item.precio };
    }
    return acc;
  }, {});

  const productosList = Object.values(productosAgrupados);

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="modal-overlay" onClick={cerrarModal}>
      <div className="modal-carrito" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛒 Tu Carrito</h2>
          <button className="cerrar-btn" onClick={cerrarModal} aria-label="Cerrar carrito">✖</button>
        </div>

        {productosList.length === 0 ? (
          <p className="vacio">Tu carrito está vacío</p>
        ) : (
          <>
            <div className="productos">
              {productosList.map((item) => (
                <div className="producto" key={item._id}>
                  <div className="mini-imagen">
                    <img 
                      src={item.imagen ? `http://localhost:5000${item.imagen}` : "/images/placeholder.png"} 
                      alt={item.nombre} 
                      loading="lazy"
                    />
                  </div>
                  <div className="info">
                    <p className="nombre">
                      {item.nombre} {item.cantidad > 1 && `x${item.cantidad}`}
                    </p>
                    <p className="precio">
                      {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(item.precioTotal)}
                    </p>
                  </div>
                  <button 
                    className="eliminar-btn" 
                    onClick={() => eliminarProducto(item._id)}
                    aria-label={`Eliminar ${item.nombre} del carrito`}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            <div className="total">
              <span>Total:</span>
              <strong>
                {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(total)}
              </strong>
            </div>

            <button 
              className="finalizar-btn" 
              onClick={finalizarCompra}
              aria-label="Finalizar compra"
            >
              🛒 Finalizar Compra
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ModalCarrito;
