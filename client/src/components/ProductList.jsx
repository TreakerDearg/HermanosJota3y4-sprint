import { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import { getImagenUrl } from "../utils/getImagenUrl";
import "../styles/components/ProductList.css";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function ProductList({ productos = [], agregarAlCarrito, verDetalle, titulo = "Nuestros Productos" }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [precioSeleccionado, setPrecioSeleccionado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const debouncedBusqueda = useDebounce(busqueda, 300);

  const productosConImagen = useMemo(() => {
    return productos.map(p => ({
      ...p,
      imagenUrl: getImagenUrl(p)
    }));
  }, [productos]);

  const categorias = useMemo(() => ["Todos", ...new Set(productos.map(p => p.categoria).filter(Boolean))], [productos]);
  const rangosPrecio = ["Todos", "Hasta $10.000", "$10.000 - $20.000", "Más de $20.000"];

  const productosFiltrados = useMemo(() => {
    return productosConImagen.filter(p => {
      const nombre = p.nombre?.toLowerCase() || "";
      const categoria = p.categoria?.toLowerCase() || "";
      const precio = p.precio || 0;

      const matchCategoria = categoriaSeleccionada === "Todos" || categoria === categoriaSeleccionada.toLowerCase();
      let matchPrecio = true;
      switch (precioSeleccionado) {
        case "Hasta $10.000": matchPrecio = precio <= 10000; break;
        case "$10.000 - $20.000": matchPrecio = precio > 10000 && precio <= 20000; break;
        case "Más de $20.000": matchPrecio = precio > 20000; break;
        default: matchPrecio = true; break;
      }
      const matchBusqueda = nombre.includes(debouncedBusqueda.toLowerCase());
      return matchCategoria && matchPrecio && matchBusqueda;
    });
  }, [productosConImagen, categoriaSeleccionada, precioSeleccionado, debouncedBusqueda]);

  return (
    <section className="product-list-section">
      <header className="section-header">
        <h2 className="product-list-title">{titulo}</h2>
        <p className="product-count">{productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s disponibles" : " disponible"}</p>
      </header>

      <div className="search-bar">
        <input type="text" placeholder="🔍 Buscar por nombre..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        {busqueda && <button className="clear-btn" onClick={() => setBusqueda("")}>✖</button>}
      </div>

      <div className="filters-container">
        <div className="category-filters">
          {categorias.map(c => (
            <button key={c} className={`category-btn ${c === categoriaSeleccionada ? "active" : ""}`} onClick={() => setCategoriaSeleccionada(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="price-filters">
          <label htmlFor="precio">💰 Precio:</label>
          <select id="precio" value={precioSeleccionado} onChange={e => setPrecioSeleccionado(e.target.value)}>
            {rangosPrecio.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="no-products">No hay productos que coincidan con tu búsqueda.</p>
      ) : (
        <div className="product-list-grid">
          {productosFiltrados.map(producto => (
            <ProductCard key={producto._id} producto={producto} agregarAlCarrito={agregarAlCarrito} verDetalle={verDetalle} />
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
