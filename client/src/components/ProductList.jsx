import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import "../styles/components/ProductList.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ProductList({
  productos = [],
  agregarAlCarrito = () => {},
  verDetalle = () => {},
  titulo = "Nuestros Productos",
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [precioSeleccionado, setPrecioSeleccionado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const categorias = useMemo(() => ["Todos", ...new Set(productos.map((p) => p.categoria).filter(Boolean))], [productos]);
  const rangosPrecio = ["Todos", "Hasta $10000", "$10000 - $20000", "Más de $20000"];

  // ===== Filtrado memoizado =====
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const nombre = p.nombre || "";
      const categoria = p.categoria || "";

      // Filtrar por categoría
      const matchCategoria =
        categoriaSeleccionada === "Todos" ||
        categoria.toLowerCase() === categoriaSeleccionada.toLowerCase();

      // Filtrar por precio
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

      // Filtrar por búsqueda
      const matchBusqueda = nombre.toLowerCase().includes(busqueda.toLowerCase());

      return matchCategoria && matchPrecio && matchBusqueda;
    });
  }, [productos, categoriaSeleccionada, precioSeleccionado, busqueda]);

  return (
    <section className="product-list-section">
      <header className="section-header">
        <h2 className="product-list-title">{titulo}</h2>
        <p className="product-count">{productosFiltrados.length} productos disponibles</p>
      </header>

      {/* ===== Barra de búsqueda ===== */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre de producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          aria-label="Buscar productos"
        />
        {busqueda && (
          <button className="clear-btn" onClick={() => setBusqueda("")} aria-label="Limpiar búsqueda">
            ✖
          </button>
        )}
      </div>

      {/* ===== Filtros ===== */}
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

      {/* ===== Grid de productos ===== */}
      {productosFiltrados.length === 0 ? (
        <p className="no-products">No hay productos disponibles con los filtros seleccionados.</p>
      ) : (
        <div className="product-list-grid">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto._id}
              producto={{
                ...producto,
                imagenUrl: producto.imagenUrl || "/images/placeholder.png",
              }}
              agregarAlCarrito={agregarAlCarrito}
              verDetalle={verDetalle}
              apiUrl={API_URL}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ===== PropTypes =====
ProductList.propTypes = {
  productos: PropTypes.array,
  agregarAlCarrito: PropTypes.func,
  verDetalle: PropTypes.func,
  titulo: PropTypes.string,
};

export default ProductList;
