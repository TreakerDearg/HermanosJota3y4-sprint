// src/pages/CheckoutPage.jsx
import { useNavigate } from "react-router-dom";
import Checkout from "../components/Checkout";
import "../styles/pages/CheckoutPage.css"; // opcional, para estilos específicos

const CheckoutPage = ({ carrito = [], vaciarCarrito, finalizarCompra }) => {
  const navigate = useNavigate();

  const handleVolverCatalogo = () => {
    navigate("/productos");
  };

  if (!carrito || carrito.length === 0) {
    return (
      <section className="checkout-empty-page" style={{ textAlign: "center", padding: "3rem" }}>
        <h2>🛒 Tu carrito está vacío</h2>
        <p>No hay productos para finalizar la compra.</p>
        <button
          onClick={handleVolverCatalogo}
          className="btn-volver-catalogo"
          aria-label="Volver al catálogo"
          style={{
            marginTop: "1.5rem",
            padding: "0.8rem 1.5rem",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          🔙 Ver Catálogo
        </button>
      </section>
    );
  }

  return (
    <section className="checkout-page" style={{ padding: "2rem" }}>
      <header className="checkout-header" style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1>🛒 Checkout</h1>
        <p>Revisa tus productos y finaliza tu compra de forma segura.</p>
        <p style={{ fontWeight: "bold" }}>{`Productos en carrito: ${carrito.length}`}</p>
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
