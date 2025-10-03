import React from "react";
import "../styles/components/Checkout.css";

function Checkout({ carrito, vaciarCarrito, eliminarProducto }) {
  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  const handleFinalizar = () => {
    if (carrito.length === 0) return;
    alert("¡Compra realizada con éxito!");
    vaciarCarrito();
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      {carrito.length === 0 ? (
        <p className="vacio">Tu carrito está vacío 😢</p>
      ) : (
        <>
          <div className="checkout-list">
            {carrito.map((item, index) => (
              <div key={index} className="checkout-item">
                <div className="producto-info">
                  {/* Imagen placeholder, reemplazable por imagen real */}
                  <div className="imagen-producto">🪑</div>
                  <div className="detalle-producto">
                    <span className="nombre">{item.nombre}</span>
                    <span className="precio">${item.precio}</span>
                  </div>
                </div>
                <button className="eliminar-btn" onClick={() => eliminarProducto(index)}>❌</button>
              </div>
            ))}
          </div>

          <div className="total-container">
            <span>Total:</span>
            <span className="total">${total}</span>
          </div>

          <div className="checkout-botones">
            <button className="finalizar-btn" onClick={handleFinalizar}>Finalizar Compra</button>
            <button className="vaciar-btn" onClick={vaciarCarrito}>Vaciar Carrito</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;
