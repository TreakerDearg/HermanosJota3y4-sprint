import { useState } from "react";
import PropTypes from "prop-types";
import "../styles/components/Checkout.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Checkout({ carrito = [], vaciarCarrito = () => {}, finalizarCompra = () => {} }) {
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const total = carrito.reduce((acc, item) => acc + item.precio * (item.cantidad || 1), 0);

  const handleFinalizar = () => {
    if (carrito.length === 0) return;
    setProcesando(true);
    setMensaje("Procesando compra...");
    setTimeout(() => {
      setMensaje("✅ ¡Compra realizada con éxito!");
      vaciarCarrito();
      finalizarCompra();
      setProcesando(false);
      setTimeout(() => setMensaje(""), 3000);
    }, 1000); // Simula proceso de pago
  };

  return (
    <section className="checkout" aria-label="Checkout de productos">
      <header className="checkout-header">
        <h2>
          <i className="fa-solid fa-cart-shopping"></i> Checkout
        </h2>
        <p>Revisa tus productos antes de finalizar la compra.</p>
      </header>

      {mensaje && <p className="checkout-mensaje" role="status">{mensaje}</p>}

      {carrito.length === 0 ? (
        <p className="checkout-empty" role="status">Tu carrito está vacío</p>
      ) : (
        <>
          <ul className="checkout-list">
            {carrito.map((item) => (
              <li key={item.id} className="checkout-card">
                <div className="checkout-card-left">
                  <img
                    src={item.imagen ? `${API_URL}${item.imagen}` : "/images/placeholder.png"}
                    alt={item.nombre || "Producto"}
                    className="checkout-img"
                    loading="lazy"
                  />
                </div>

                <div className="checkout-card-center">
                  <h3 className="checkout-name">{item.nombre || "Producto"}</h3>
                  <p className="checkout-desc">{item.descripcion || ""}</p>
                  {item.cantidad > 1 && (
                    <span className="checkout-cantidad" aria-label={`Cantidad: ${item.cantidad}`}>{item.cantidad}x</span>
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

          <footer className="checkout-footer">
            <div className="checkout-total">
              <span>Total:</span>
              <span className="total-amount">
                {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}
              </span>
            </div>

            <div className="checkout-actions">
              <button
                className="btn-finalizar"
                onClick={handleFinalizar}
                disabled={carrito.length === 0 || procesando}
                aria-label="Finalizar compra"
              >
                <i className="fa-solid fa-flag-checkered"></i> Finalizar Compra
              </button>

              <button
                className="btn-vaciar"
                onClick={vaciarCarrito}
                disabled={carrito.length === 0 || procesando}
                aria-label="Vaciar carrito"
              >
                <i className="fa-solid fa-trash-can"></i> Vaciar Carrito
              </button>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}

// ===== PropTypes =====
Checkout.propTypes = {
  carrito: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string,
      precio: PropTypes.number,
      cantidad: PropTypes.number,
      descripcion: PropTypes.string,
      imagen: PropTypes.string,
    })
  ),
  vaciarCarrito: PropTypes.func,
  finalizarCompra: PropTypes.func,
};

export default Checkout;
