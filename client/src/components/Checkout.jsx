import "../styles/components/Checkout.css";

function Checkout({ carrito = [], vaciarCarrito = () => {}, eliminarProducto = () => {} }) {
  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  const handleFinalizar = () => {
    if (carrito.length === 0) return;
    alert("¡Compra realizada con éxito!");
    vaciarCarrito();
  };

  return (
    <section className="checkout">
      <h2 className="checkout-title">🛒 Checkout</h2>

      {carrito.length === 0 ? (
        <p className="vacio">Tu carrito está vacío 😢</p>
      ) : (
        <>
          <div className="checkout-list">
            {carrito.map((item, index) => (
              <div key={index} className="checkout-item">
                <div className="producto-card">
                  {/* Imagen / ícono */}
                  <div className="imagen-producto">🪑</div>

                  {/* Detalles del producto */}
                  <div className="detalle-producto">
                    <span className="nombre">{item.nombre}</span>
                    <span className="precio">${item.precio.toFixed(2)}</span>
                  </div>

                  {/* Botón eliminar con protección */}
                  <button
                    className="eliminar-btn"
                    onClick={() => eliminarProducto?.(index)}
                    title="Eliminar producto"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="total-container">
            <span>Total:</span>
            <span className="total">${total.toFixed(2)}</span>
          </div>

          {/* Botones de acción */}
          <div className="checkout-buttons">
            <button className="finalizar-btn" onClick={handleFinalizar}>
              🏁 Finalizar Compra
            </button>
            <button className="vaciar-btn" onClick={vaciarCarrito}>
              🗑 Vaciar Carrito
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Checkout;
