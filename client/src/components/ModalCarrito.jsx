// src/components/ModalCarrito.jsx
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useUI } from "../context/UIContext";
import { useAuth } from "../context/AuthContext"; // ✅ nuevo
import "../styles/components/ModalCarrito.css";

const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");

const modalRoot = document.getElementById("modal-root") || (() => {
  const el = document.createElement("div");
  el.id = "modal-root";
  document.body.appendChild(el);
  return el;
})();

export default function ModalCarrito() {
  const { carrito, eliminarProducto, total } = useCart();
  const { modalCarrito, toggleModalCarrito } = useUI();
  const { user } = useAuth(); // ✅ obtener usuario
  const navigate = useNavigate();
  const [toast, setToast] = useState("");

  // Cerrar con ESC
  useEffect(() => {
    if (!modalCarrito) return;
    const handleEsc = (e) => e.key === "Escape" && toggleModalCarrito();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [modalCarrito, toggleModalCarrito]);

  const productosList = useMemo(
    () =>
      carrito.map((item) => ({
        ...item,
        imagenUrl: item.imagenUrl?.startsWith("/uploads")
          ? `${API_BASE}${item.imagenUrl}`
          : item.imagenUrl || "/images/placeholder.png",
      })),
    [carrito]
  );

  const handleFinalizarCompra = () => {
    if (!user) {
      setToast("Debes iniciar sesión para finalizar la compra");
      setTimeout(() => setToast(""), 3000);
      return;
    }
    toggleModalCarrito();
    navigate("/checkout");
  };

  if (!modalCarrito) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={toggleModalCarrito}>
      <div className="modal-carrito" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛒 Tu Carrito</h2>
          <button className="cerrar-btn" onClick={toggleModalCarrito} aria-label="Cerrar carrito">
            ✖
          </button>
        </div>

        {!user ? (
          <p className="vacio">Inicia sesión para ver tu carrito</p>
        ) : productosList.length === 0 ? (
          <p className="vacio">Tu carrito está vacío</p>
        ) : (
          <>
            <div className="productos">
              {productosList.map((item) => (
                <div className="producto" key={item._id}>
                  <div className="mini-imagen">
                    <img src={item.imagenUrl} alt={item.nombre} loading="lazy" />
                  </div>
                  <div className="info">
                    <p>{item.nombre}</p>
                    <p className="precio">
                      {new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 0,
                      }).format(item.precio * (item.cantidad || 1))}
                    </p>
                  </div>
                  <button
                    className="eliminar-btn"
                    onClick={() => eliminarProducto(item._id)}
                    aria-label={`Eliminar ${item.nombre} del carrito`}
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>

            <div className="total">
              <span>Total:</span>
              <strong>
                {new Intl.NumberFormat("es-AR", {
                  style: "currency",
                  currency: "ARS",
                  minimumFractionDigits: 0,
                }).format(total)}
              </strong>
            </div>

            <div className="modal-actions">
              <button
                className="finalizar-btn"
                onClick={handleFinalizarCompra}
                disabled={productosList.length === 0}
              >
                🏁 Finalizar Compra
              </button>
            </div>
          </>
        )}

        {/* Toast */}
        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
}
