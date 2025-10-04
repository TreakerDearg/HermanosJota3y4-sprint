import "../styles/components/ModalCarrito.css";

function ModalCarrito({ carrito, cerrarModal, finalizarCompra, eliminarProducto }) {
  // Agrupar productos por id
  const productosAgrupados = carrito.reduce((acc, item) => {
    if (acc[item.id]) {
      acc[item.id].cantidad += 1;
      acc[item.id].precioTotal += item.precio;
    } else {
      acc[item.id] = { ...item, cantidad: 1, precioTotal: item.precio };
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
          <button className="cerrar-btn" onClick={cerrarModal}>✖</button>
        </div>

        {productosList.length === 0 ? (
          <p className="vacio">Tu carrito está vacío</p>
        ) : (
          <>
            <div className="productos">
              {productosList.map((item) => (
                <div className="producto" key={item.id}>
                  <div className="mini-imagen">
                    <img 
                      src={`http://localhost:5000${item.imagen}`} 
                      alt={item.nombre} 
                      loading="lazy"
                    />
                  </div>
                  <div className="info">
                    <p className="nombre">
                      {item.nombre} {item.cantidad > 1 && `x${item.cantidad}`}
                    </p>
                    <p className="precio">AR$ {item.precioTotal.toLocaleString()}</p>
                  </div>
                  <button 
                    className="eliminar-btn" 
                    onClick={() => eliminarProducto(item.id)}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            <div className="total">
              <span>Total:</span>
              <strong>AR$ {total.toLocaleString()}</strong>
            </div>

            <button className="finalizar-btn" onClick={finalizarCompra}>
              🛒 Finalizar Compra
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ModalCarrito;
