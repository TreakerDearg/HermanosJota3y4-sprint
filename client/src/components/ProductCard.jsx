import "../styles/components/ProductCard.css";

function ProductCard({ producto, verDetalle }) {
  return (
    <div className="product-card">
      <h2>{producto.nombre}</h2>
      <p>Precio: ${producto.precio}</p>
      <button onClick={() => verDetalle(producto)}>Ver Detalle</button>
    </div>
  );
}

export default ProductCard;
