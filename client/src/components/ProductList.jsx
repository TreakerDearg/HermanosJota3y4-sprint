import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import "../styles/components/ProductList.css";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://hermanosjota3y4-sprint.onrender.com/api";
const API_IMG = API_BASE.replace(/\/api$/, "");

function ProductList({
  productos = [],
  agregarAlCarrito = () => {},
  verDetalle = () => {},
  titulo = "Nuestros Productos",
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [precioSeleccionado, setPrecioSeleccionado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const categorias = useMemo(
    () => ["Todos", ...new Set(productos.map((p) => p.categoria).filter(Boolean))],
    [productos]
  );

  const rangosPrecio = ["Todos", "Hasta $10000", "$10000 - $20000", "Más de $20000"];

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const nombre = p.nombre || "";
      const categoria = p.categoria || "";

      const matchCategoria =
        categoriaSeleccionada === "Todos" ||
        categoria.toLowerCase() === categoriaSeleccionada.toLowerCase();

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
  }, [productos, categoriaSeleccionada, precioSeleccionado, busqueda]);

  return (
    <section className="product-list-section">
      <header className="section-header">
        <h2 className="product-list-title">{titulo}</h2>
        <p className="product-count">{productosFiltrados.length} productos disponibles</p>
      </header>

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
              producto={{
                ...producto,
                imagenUrl: producto.imagenUrl
                  ? producto.imagenUrl.startsWith("http")
                    ? producto.imagenUrl
                    : `${API_IMG}/${producto.imagenUrl.replace(/^\/+/, "")}`
                  : "/images/placeholder.png",
              }}
              agregarAlCarrito={agregarAlCarrito}
              verDetalle={verDetalle}
            />
          ))}
        </div>
      )}
    </section>
  );
}

ProductList.propTypes = {
  productos: PropTypes.array,
  agregarAlCarrito: PropTypes.func,
  verDetalle: PropTypes.func,
  titulo: PropTypes.string,
};

export default ProductList;
