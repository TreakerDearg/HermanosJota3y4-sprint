import "../styles/components/Checkout.css";

function Checkout({ carrito = [], vaciarCarrito = () => {}, finalizarCompra = () => {} }) {
  // Calculamos total considerando cantidad
  const total = carrito.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);

  const handleFinalizar = () => {
    if (carrito.length === 0) return;
    alert("¡Compra realizada con éxito!");
    vaciarCarrito();
  };

  return (
    <section className="checkout">
      {/* Header */}
      <header className="checkout-header">
        <h2>
          <i className="fa-solid fa-cart-shopping"></i> Checkout
        </h2>
        <p>Revisa tus productos antes de finalizar la compra.</p>
      </header>

      {/* Carrito vacío */}
      {carrito.length === 0 ? (
        <p className="checkout-empty">Tu carrito está vacío</p>
      ) : (
        <>
          {/* Lista de productos */}
          <ul className="checkout-list">
            {carrito.map((item) => (
              <li key={item.id} className="checkout-card">
                <div className="checkout-card-left">
                  <img
                    src={`http://localhost:5000${item.imagen}`}
                    alt={item.nombre}
                    className="checkout-img"
                  />
                </div>

                <div className="checkout-card-center">
                  <h3 className="checkout-name">{item.nombre}</h3>
                  <p className="checkout-desc">{item.descripcion}</p>
                  {item.cantidad > 1 && (
                    <span className="checkout-cantidad">{item.cantidad}x</span>
                  )}
                </div>

                <div className="checkout-card-right">
                  <span className="checkout-price">
                    {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(item.precio * (item.cantidad || 1))}
                  </span>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer con total y botones */}
          <footer className="checkout-footer">
            <div className="checkout-total">
              <span>Total:</span>
              <span className="total-amount">
                {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}
              </span>
            </div>

            <div className="checkout-actions">
              <button className="btn-finalizar" onClick={handleFinalizar}>
                <i className="fa-solid fa-flag-checkered"></i> Finalizar Compra
              </button>
              <button className="btn-vaciar" onClick={vaciarCarrito}>
                <i className="fa-solid fa-trash-can"></i> Vaciar Carrito
              </button>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}

export default Checkout;
