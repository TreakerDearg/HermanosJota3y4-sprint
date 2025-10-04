import { useState } from "react";
import ProductCard from "./ProductCard";
import "../styles/components/ProductList.css";

function ProductList({ productos = [], verDetalle, titulo = "Nuestros Productos" }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

  // Asegurarse de que productos es un array y que categoria existe
  const productosValidos = Array.isArray(productos) ? productos : [];

  // Obtener categorías únicas
  const categorias = [
    "Todos",
    ...new Set(
      productosValidos
        .map((p) => p.categoria)
        .filter((c) => c) // eliminar undefined o null
    )
  ];

  // Filtrar productos por categoría
  const productosFiltrados =
    categoriaSeleccionada === "Todos"
      ? productosValidos
      : productosValidos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <section className="product-list-section">
      {/* Título de la sección */}
      <div className="section-header">
        <h2 className="product-list-title">{titulo}</h2>
        <p className="product-count">{productosFiltrados.length} productos disponibles</p>
      </div>

      {/* Filtros de categoría */}
      <div className="category-filters">
        {categorias.map((c) => (
          <button
            key={c}
            className={`category-btn ${c === categoriaSeleccionada ? "active" : ""}`}
            onClick={() => setCategoriaSeleccionada(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Mensaje si no hay productos */}
      {productosFiltrados.length === 0 ? (
        <p className="no-products">No hay productos disponibles en esta categoría.</p>
      ) : (
        <div className="product-list-grid">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              verDetalle={verDetalle}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
