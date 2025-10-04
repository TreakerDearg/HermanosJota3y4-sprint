import { useState } from "react";
import "../styles/components/ProductList.css";

function ProductList({ productos = [], verDetalle, titulo = "Nuestros Productos" }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [precioSeleccionado, setPrecioSeleccionado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const productosValidos = Array.isArray(productos) ? productos : [];

  // Categorías fijas
  const categorias = ["Todos", "Mesas", "Sillas", "Estantes", "Escritorios"];

  // Rangos de precio
  const rangosPrecio = ["Todos", "Hasta $10000", "$10000 - $20000", "Más de $20000"];

  // Filtrado seguro
  const productosFiltrados = productosValidos.filter((p) => {
    const categoria = p.categoria || "";
    const nombre = p.nombre || "";

    // Filtrado por categoría
    const matchCategoria =
      categoriaSeleccionada === "Todos" || categoria.toLowerCase() === categoriaSeleccionada.toLowerCase();

    // Filtrado por precio
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

    // Filtrado por búsqueda
    const matchBusqueda = nombre.toLowerCase().includes(busqueda.toLowerCase());

    return matchCategoria && matchPrecio && matchBusqueda;
  });

  return (
    <section className="product-list-section">
      {/* Título */}
      <div className="section-header">
        <h2 className="product-list-title">{titulo}</h2>
        <p className="product-count">{productosFiltrados.length} productos disponibles</p>
      </div>

      {/* Buscador */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
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

      {/* Productos */}
      {productosFiltrados.length === 0 ? (
        <p className="no-products">No hay productos disponibles con los filtros seleccionados.</p>
      ) : (
        <div className="product-list-grid">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="producto-card"
              onClick={() => verDetalle(producto)}
            >
              <div className="producto-imagen">
                <img
                  src={producto.imagen ? `http://localhost:5000${producto.imagen}` : "/images/placeholder.png"}
                  alt={producto.nombre || "Producto"}
                  className="producto-img"
                />
              </div>
              <div className="producto-info">
                <span className="producto-categoria">{producto.categoria || "Sin categoría"}</span>
                <h3 className="producto-nombre">{producto.nombre || "Producto"}</h3>
                <p className="producto-precio">
                  AR$ {producto.precio ? producto.precio.toLocaleString() : "0"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
