import ProductCard from "./ProductCard";
import "../styles/components/ProductList.css";

function ProductList({ productos, verDetalle }) {
  return (
    <div className="product-list">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          verDetalle={verDetalle}
        />
      ))}
    </div>
  );
}

export default ProductList;
