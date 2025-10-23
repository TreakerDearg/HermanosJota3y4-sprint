import { useState } from "react";
import ProductCard from "./ProductCard";
import "../styles/components/ProductList.css";

function ProductList({ productos = [], agregarAlCarrito, verDetalle, titulo = "Nuestros Productos" }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [precioSeleccionado, setPrecioSeleccionado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const productosValidos = Array.isArray(productos) ? productos : [];
  const categorias = ["Todos", "Mesas", "Sillas", "Estantes", "Escritorios"];
  const rangosPrecio = ["Todos", "Hasta $10000", "$10000 - $20000", "Más de $20000"];

  const productosFiltrados = productosValidos.filter((p) => {
    const categoria = p.categoria || "";
    const nombre = p.nombre || "";

    const matchCategoria =
      categoriaSeleccionada === "Todos" || categoria.toLowerCase() === categoriaSeleccionada.toLowerCase();

    let matchPrecio = true;
    switch (precioSeleccionado) {
      case "Hasta $10000":
        matchPrecio = p.precio <= 10000;
        break;
      case "$10000 - $20000":
        matchPrecio = p.precio > 10000 && p.precio <= 20000;
        break;
      case "Más de $20000":
        matchPrecio = p.precio > 20000;
        break;
      default:
        matchPrecio = true;
    }

    const matchBusqueda = nombre.toLowerCase().includes(busqueda.toLowerCase());
    return matchCategoria && matchPrecio && matchBusqueda;
  });

  return (
    <section className="product-list-section">
      <div className="section-header">
        <h2 className="product-list-title">{titulo}</h2>
        <p className="product-count">{productosFiltrados.length} productos disponibles</p>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar productos"
        />
      </div>

      <div className="filters-container">
        <div className="category-filters" role="group" aria-label="Filtrar por categoría">
          {categorias.map((c) => (
            <button
              key={c}
              className={`category-btn ${c === categoriaSeleccionada ? "active" : ""}`}
              onClick={() => setCategoriaSeleccionada(c)}
              aria-pressed={c === categoriaSeleccionada}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="price-filters">
          <label htmlFor="precio">Filtrar por precio:</label>
          <select
            id="precio"
            value={precioSeleccionado}
            onChange={(e) => setPrecioSeleccionado(e.target.value)}
          >
            {rangosPrecio.map((rango) => (
              <option key={rango} value={rango}>
                {rango}
              </option>
            ))}
          </select>
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="no-products">No hay productos disponibles con los filtros seleccionados.</p>
      ) : (
        <div className="product-list-grid">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto._id}
              producto={producto}
              agregarAlCarrito={typeof agregarAlCarrito === "function" ? agregarAlCarrito : () => {}}
              verDetalle={typeof verDetalle === "function" ? verDetalle : () => {}}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
