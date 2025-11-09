import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import "../styles/components/ProductList.css";

// eslint-disable-next-line no-unused-vars
const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");


function ProductList({
  productos = [],
  agregarAlCarrito = () => {},
  verDetalle = () => {},
  titulo = "Nuestros Productos",
}) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [precioSeleccionado, setPrecioSeleccionado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  // 🔹 Categorías dinámicas
  const categorias = useMemo(
    () => ["Todos", ...new Set(productos.map((p) => p.categoria).filter(Boolean))],
    [productos]
  );

  // 🔹 Rangos de precio fijos
  const rangosPrecio = ["Todos", "Hasta $10.000", "$10.000 - $20.000", "Más de $20.000"];

  // 🔹 Filtrado inteligente
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const nombre = p.nombre?.toLowerCase() || "";
      const categoria = p.categoria?.toLowerCase() || "";
      const precio = p.precio || 0;

      const matchCategoria =
        categoriaSeleccionada === "Todos" ||
        categoria === categoriaSeleccionada.toLowerCase();

      let matchPrecio = true;
      switch (precioSeleccionado) {
        case "Hasta $10.000":
          matchPrecio = precio <= 10000;
          break;
        case "$10.000 - $20.000":
          matchPrecio = precio > 10000 && precio <= 20000;
          break;
        case "Más de $20.000":
          matchPrecio = precio > 20000;
          break;
        default:
          matchPrecio = true;
      }

      const matchBusqueda = nombre.includes(busqueda.toLowerCase());
      return matchCategoria && matchPrecio && matchBusqueda;
    });
  }, [productos, categoriaSeleccionada, precioSeleccionado, busqueda]);

  return (
    <section className="product-list-section">
      {/* Encabezado */}
      <header className="section-header">
        <h2 className="product-list-title">{titulo}</h2>
        <p className="product-count">
          {productosFiltrados.length} producto
          {productosFiltrados.length !== 1 && "s"} disponible
          {productosFiltrados.length !== 1 && "s"}
        </p>
      </header>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button className="clear-btn" onClick={() => setBusqueda("")}>
            ✖
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="filters-container">
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

        <div className="price-filters">
          <label htmlFor="precio">💰 Precio:</label>
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

      {/* Grid de productos */}
      {productosFiltrados.length === 0 ? (
        <p className="no-products">No hay productos que coincidan con tu búsqueda.</p>
      ) : (
        <div className="product-list-grid">
          {productosFiltrados.map((producto) => {
            // 🔹 Imagen segura con fallback
            const imagenUrl =
              producto.imagenUrl ||
              producto.imagen ||
              "/images/placeholder.png";

            return (
              <ProductCard
                key={producto._id}
                producto={{ ...producto, imagenUrl }}
                agregarAlCarrito={agregarAlCarrito}
                verDetalle={verDetalle}
              />
            );
          })}
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
