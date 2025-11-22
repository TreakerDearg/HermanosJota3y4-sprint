import { useState, useEffect, useMemo } from "react";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Search, Filter } from "lucide-react";
import "../styles/pages/EliminarProducto.css";

export default function EliminarProducto() {
  const { productos, fetchProductos, eliminarProducto } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mensaje, setMensaje] = useState("");
  const [eliminandoId, setEliminandoId] = useState(null);

  // 🔍 Filtros
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  // Protección de ruta
  useEffect(() => {
    if (!user) navigate("/auth");
    else if (user.rol !== "admin") navigate("/");
  }, [user, navigate]);

  // Cargar productos
  useEffect(() => {
    if (!productos || productos.length === 0) fetchProductos();
  }, [productos, fetchProductos]);

  // 🔄 Filtrado eficiente con useMemo
  const productosFiltrados = useMemo(() => {
    return productos
      .filter((p) =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
      .filter((p) =>
        categoria === "todas" ? true : p.categoria === categoria
      )
      .filter((p) =>
        precioMin ? p.precio >= Number(precioMin) : true
      )
      .filter((p) =>
        precioMax ? p.precio <= Number(precioMax) : true
      );
  }, [productos, busqueda, categoria, precioMin, precioMax]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este producto?")) return;

    setEliminandoId(id);
    setMensaje("");

    try {
      await eliminarProducto(id);
      setMensaje("✔ Producto eliminado correctamente");
      await fetchProductos();
    } catch (err) {
      const msg = err?.response?.data?.mensaje || err?.message || "Error al eliminar";
      setMensaje("❌ " + msg);
    } finally {
      setEliminandoId(null);
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  if (!productos) return <p className="loading">Cargando productos...</p>;

  // Obtener categorías únicas
  const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];

  return (
    <section className="eliminar-producto">
      <h2 className="titulo-principal">Eliminar Producto</h2>

      {/* Mensajes */}
      {mensaje && (
        <p className={`mensaje ${mensaje.startsWith("✔") ? "exito" : "error"}`}>
          {mensaje}
        </p>
      )}

      {/* ===========================
             FILTROS AVANZADOS
      ============================ */}
      <div className="filtros-contenedor">
        {/* Buscar */}
        <div className="filtro-item">
          <Search className="icono-filtro" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Categoría */}
        <div className="filtro-item">
          <Filter className="icono-filtro" size={20} />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="todas">Todas las categorías</option>
            {categoriasUnicas.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Precio */}
        <div className="filtro-item">
          <input
            type="number"
            placeholder="Precio mín"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
          />
        </div>

        <div className="filtro-item">
          <input
            type="number"
            placeholder="Precio máx"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
          />
        </div>
      </div>

      {/* Lista */}
      {productosFiltrados.length === 0 ? (
        <p className="sin-productos">No se encontraron productos.</p>
      ) : (
        <ul className="lista-productos">
          {productosFiltrados.map((p) => (
            <li key={p._id} className="producto-card">
              <img src={p.imagenUrl || p.imagen} alt={p.nombre} className="producto-img" />

              <div className="producto-detalles">
                <h3>{p.nombre}</h3>
                <p>Precio: ${p.precio}</p>
                <p>Categoría: {p.categoria}</p>
                <p>Stock: {p.stock}</p>
              </div>

              <button
                className="btn-eliminar"
                onClick={() => handleEliminar(p._id)}
                disabled={eliminandoId === p._id}
              >
                {eliminandoId === p._id ? "Eliminando..." : <Trash2 size={18} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
