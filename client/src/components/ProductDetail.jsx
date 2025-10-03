import "../styles/components/ProductDetail.css";

function ProductDetail({ producto, agregarAlCarrito, volver }) {
  return (
    <div className="product-detail">
      <h1>{producto.nombre}</h1>
      <p><strong>Precio:</strong> ${producto.precio}</p>
      <p><strong>Descripción:</strong> {producto.descripcion}</p>

      <div className="buttons">
        <button onClick={() => agregarAlCarrito(producto)}>
          Añadir al Carrito
        </button>
        <button onClick={volver}>Volver al Catálogo</button>
      </div>
    </div>
  );
}

export default ProductDetail;
