import "../styles/components/ModalCarrito.css";

function ModalCarrito({ carrito, cerrarModal, finalizarCompra, eliminarProducto }) {
  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="modal-overlay" onClick={cerrarModal}>
      <div className="modal-carrito" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛒 Carrito de Compras</h2>
          <button className="cerrar-btn" onClick={cerrarModal}>✖</button>
        </div>

        {carrito.length === 0 ? (
          <p className="vacio">Tu carrito está vacío</p>
        ) : (
          <>
            <div className="productos">
              {carrito.map((item, index) => (
                <div className="producto" key={index}>
                  <div className="mini-imagen">🪑</div>
                  <div className="info">
                    <p className="nombre">{item.nombre}</p>
                    <p className="precio">${item.precio}</p>
                  </div>
                  <button className="eliminar-btn" onClick={() => eliminarProducto(index)}>❌</button>
                </div>
              ))}
            </div>

            <div className="total">
              <span>Total:</span>
              <strong>${total}</strong>
            </div>

            <button className="finalizar-btn" onClick={finalizarCompra}>
              Finalizar Compra
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ModalCarrito;
