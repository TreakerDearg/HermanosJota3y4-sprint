import { useEffect } from "react";
import PropTypes from "prop-types";
import "../styles/components/ModalCarrito.css";

// ============================
// 🔹 Configuración de API
// ============================
// Usa variable de entorno de Netlify si está definida
const API_BASE = process.env.REACT_APP_API_URL || "https://hermanosjota3y4-sprint.onrender.com";

function ModalCarrito({
  carrito = [],
  cerrarModal,
  finalizarCompra = () => {},
  eliminarProducto = () => {},
}) {
  // ============================
  // 🔹 Cerrar con tecla ESC
  // ============================
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && cerrarModal();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [cerrarModal]);

  // ============================
  // 🔹 Agrupar productos por ID
  // ============================
  const productosAgrupados = carrito.reduce((acc, item) => {
    const key = item._id;
    if (acc[key]) {
      acc[key].cantidad += 1;
      acc[key].precioTotal += item.precio || 0;
    } else {
      acc[key] = { ...item, cantidad: 1, precioTotal: item.precio || 0 };
    }
    return acc;
  }, {});

  const productosList = Object.values(productosAgrupados);
  const total = productosList.reduce((acc, item) => acc + item.precioTotal, 0);

  // ============================
  // 🔹 Render
  // ============================
  return (
    <div
      className="modal-overlay"
      onClick={cerrarModal}
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      <div className="modal-carrito" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🛒 Tu Carrito</h2>
          <button className="cerrar-btn" onClick={cerrarModal} aria-label="Cerrar carrito">
            ✖
          </button>
        </div>

        {productosList.length === 0 ? (
          <p className="vacio" role="status">
            Tu carrito está vacío
          </p>
        ) : (
          <>
            <div className="productos">
              {productosList.map((item) => {
                const nombre = item.nombre || "Producto";

                // 🔹 Normaliza URL de imagen
                let imagenUrl = "/images/placeholder.png";
                if (item.imagenUrl) {
                  imagenUrl = item.imagenUrl.startsWith("http")
                    ? item.imagenUrl
                    : `${API_BASE}${item.imagenUrl.startsWith("/") ? "" : "/"}${item.imagenUrl}`;
                }

                return (
                  <div className="producto" key={item._id}>
                    <div className="mini-imagen">
                      <img src={imagenUrl} alt={nombre} loading="lazy" draggable={false} />
                    </div>

                    <div className="info">
                      <p className="nombre">
                        {nombre} {item.cantidad > 1 && <span>x{item.cantidad}</span>}
                      </p>
                      <p className="precio">
                        {new Intl.NumberFormat("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 0,
                        }).format(item.precioTotal)}
                      </p>
                    </div>

                    <button
                      className="eliminar-btn"
                      onClick={() => eliminarProducto(item._id)}
                      aria-label={`Eliminar ${nombre} del carrito`}
                    >
                      ❌
                    </button>
                  </div>
                );
              })}
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
                onClick={finalizarCompra}
                disabled={productosList.length === 0}
                aria-label="Finalizar compra"
              >
                🏁 Finalizar Compra
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================
// 🔹 Validación de props
// ============================
ModalCarrito.propTypes = {
  carrito: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      nombre: PropTypes.string,
      precio: PropTypes.number,
      categoria: PropTypes.string,
      imagenUrl: PropTypes.string,
    })
  ),
  cerrarModal: PropTypes.func.isRequired,
  finalizarCompra: PropTypes.func,
  eliminarProducto: PropTypes.func,
};

export default ModalCarrito;
