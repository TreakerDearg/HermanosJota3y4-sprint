import Checkout from "../components/Checkout";

const CheckoutPage = ({ carrito, vaciarCarrito }) => {
  if (!carrito || carrito.length === 0)
    return <p style={{ textAlign: "center" }}>No hay productos en el carrito.</p>;

  return <Checkout carrito={carrito} vaciarCarrito={vaciarCarrito} />;
};

export default CheckoutPage;
