import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import "../styles/components/Checkout.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Checkout({ carrito = [], vaciarCarrito = () => {}, finalizarCompra = () => {} }) {
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // ===== Agrupar productos por _id =====
  const productosAgrupados = useMemo(() => {
    const grouped = carrito.reduce((acc, item) => {
      const key = item._id;
      if (acc[key]) {
        acc[key].cantidad += 1;
        acc[key].precioTotal += item.precio || 0;
      } else {
        acc[key] = { ...item, cantidad: 1, precioTotal: item.precio || 0 };
      }
      return acc;
    }, {});
    return Object.values(grouped);
  }, [carrito]);

  const total = productosAgrupados.reduce((acc, item) => acc + item.precioTotal, 0);

  const handleFinalizar = () => {
    if (!productosAgrupados.length) return;
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

      {productosAgrupados.length === 0 ? (
        <p className="checkout-empty" role="status">Tu carrito está vacío</p>
      ) : (
        <>
          <ul className="checkout-list">
            {productosAgrupados.map((item) => (
              <li key={item._id} className="checkout-card">
                <div className="checkout-card-left">
                  <img
                    src={item.imagenUrl ? `${API_URL}${item.imagenUrl}` : "/images/placeholder.png"}
                    alt={item.nombre || "Producto"}
                    className="checkout-img"
                    loading="lazy"
                    draggable={false}
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
                    {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(item.precioTotal)}
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
                disabled={procesando || productosAgrupados.length === 0}
                aria-label="Finalizar compra"
              >
                <i className="fa-solid fa-flag-checkered"></i> Finalizar Compra
              </button>

              <button
                className="btn-vaciar"
                onClick={vaciarCarrito}
                disabled={procesando || productosAgrupados.length === 0}
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
      _id: PropTypes.string.isRequired,
      nombre: PropTypes.string,
      precio: PropTypes.number,
      cantidad: PropTypes.number,
      descripcion: PropTypes.string,
      imagenUrl: PropTypes.string,
    })
  ),
  vaciarCarrito: PropTypes.func,
  finalizarCompra: PropTypes.func,
};

export default Checkout;
