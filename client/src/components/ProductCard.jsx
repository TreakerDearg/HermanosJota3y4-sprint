import "../styles/components/ProductCard.css";

function ProductCard({ producto, agregarAlCarrito, verDetalle }) {
  const handleClickCard = () => {
    if (verDetalle) verDetalle(producto);
  };

  const handleAgregarAlCarrito = (e) => {
    e.stopPropagation(); // Evita que el clic navegue al detalle
    if (agregarAlCarrito) agregarAlCarrito(producto);
  };

  return (
    <div
      className="producto-card"
      onClick={handleClickCard}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === "Enter") handleClickCard(); }}
      aria-label={`Ver detalles de ${producto.nombre}`}
    >
      <div className="producto-imagen">
        <img
          src={producto.imagen ? `http://localhost:5000${producto.imagen}` : "/images/placeholder.png"}
          alt={producto.nombre || "Producto"}
          className="producto-img"
          loading="lazy"
        />
      </div>

      <div className="producto-info">
        <span className="producto-categoria">{producto.categoria || "Sin categoría"}</span>
        <h3 className="producto-nombre">{producto.nombre || "Producto"}</h3>
        <p className="producto-precio">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
          }).format(producto.precio || 0)}
        </p>

        {agregarAlCarrito && (
          <button
            className="add-to-cart-btn"
            onClick={handleAgregarAlCarrito}
            aria-label={`Agregar ${producto.nombre} al carrito`}
          >
            🛒 Agregar al carrito
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
