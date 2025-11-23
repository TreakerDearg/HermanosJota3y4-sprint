import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/components/Checkout.css";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

export default function Checkout() {
  const { carrito, actualizarCantidad, eliminarProducto, vaciarCarrito, total } = useCart();
  const { user } = useAuth();
  const [recibo, setRecibo] = useState(null);

  useEffect(() => {
    if (!user) return;
    // Inicializar historial vacío si no existe
    const saved = localStorage.getItem(`historial_${user._id}`);
    if (!saved) localStorage.setItem(`historial_${user._id}`, JSON.stringify([]));
  }, [user]);

  const handleFinalizarCompra = () => {
    if (!user || carrito.length === 0) return;

    // Crear recibo de compra
    const nuevoRecibo = {
      fecha: new Date(),
      productos: carrito.map(p => ({
        nombre: p.nombre,
        precio: p.precio,
        cantidad: p.cantidad
      })),
      total
    };
    setRecibo(nuevoRecibo);

    // Guardar en historial del usuario
    const historialKey = `historial_${user._id}`;
    const historialActual = JSON.parse(localStorage.getItem(historialKey) || "[]");
    const nuevoHistorial = [nuevoRecibo, ...historialActual];
    localStorage.setItem(historialKey, JSON.stringify(nuevoHistorial));

    // Vaciar carrito
    vaciarCarrito();
  };

  return (
    <div className="checkout-container">
      {!recibo ? (
        <>
          <div className="checkout-list">
            {carrito.map(item => (
              <div className="checkout-item" key={item._id}>
                <div className="checkout-img">
                  <img src={item.imagenUrl || "/images/placeholder.png"} alt={item.nombre} />
                </div>
                <div className="checkout-info">
                  <p className="nombre">{item.nombre}</p>
                  <div className="cantidad-control">
                    <button
                      onClick={() => actualizarCantidad(item._id, (item.cantidad || 1) - 1)}
                      disabled={item.cantidad <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item._id, (item.cantidad || 1) + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <p className="precio">
                    {new Intl.NumberFormat("es-AR", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 0,
                    }).format((item.precio || 0) * (item.cantidad || 1))}
                  </p>
                </div>
                <button className="eliminar-btn" onClick={() => eliminarProducto(item._id)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="checkout-total">
            <span>Total:</span>
            <strong>
              {new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 0,
              }).format(total)}
            </strong>
          </div>

          <div className="checkout-actions">
            <button
              className="finalizar-btn"
              onClick={handleFinalizarCompra}
              disabled={carrito.length === 0}
            >
              Finalizar Compra
            </button>
          </div>
        </>
      ) : (
        <div className="recibo">
          <h2>🧾 Recibo de Compra</h2>
          <p>Fecha: {recibo.fecha.toLocaleString()}</p>
          <ul>
            {recibo.productos.map((p, idx) => (
              <li key={idx}>
                {p.nombre} x{p.cantidad} -{" "}
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 0,
                }).format(p.precio * p.cantidad)}
              </li>
            ))}
          </ul>
          <p className="total-recibo">
            Total:{" "}
            {new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 0,
            }).format(recibo.total)}
          </p>
          <p className="gracias">¡Gracias por tu compra!</p>
        </div>
      )}
    </div>
  );
}
