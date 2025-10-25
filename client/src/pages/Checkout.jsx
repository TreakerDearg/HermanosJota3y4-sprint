// src/pages/CheckoutPage.jsx
import { useNavigate } from "react-router-dom";
import Checkout from "../components/Checkout";
import "../styles/pages/CheckoutPage.css";

const CheckoutPage = ({ carrito = [], vaciarCarrito, finalizarCompra }) => {
  const navigate = useNavigate();

  const handleVolverCatalogo = () => navigate("/productos");

  if (!carrito || carrito.length === 0) {
    return (
      <section className="checkout-empty-page">
        <h2>🛒 Tu carrito está vacío</h2>
        <p>No hay productos para finalizar la compra.</p>
        <button
          onClick={handleVolverCatalogo}
          className="btn-volver-catalogo"
          aria-label="Volver al catálogo"
        >
          🔙 Ver Catálogo
        </button>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <header className="checkout-header">
        <h1>🛒 Checkout</h1>
        <p>Revisa tus productos y finaliza tu compra de forma segura.</p>
        <p className="checkout-count">
          <strong>{`Productos en carrito: ${carrito.length}`}</strong>
        </p>
      </header>

      <Checkout
        carrito={carrito}
        vaciarCarrito={vaciarCarrito}
        finalizarCompra={finalizarCompra}
      />
    </section>
  );
};

export default CheckoutPage;
