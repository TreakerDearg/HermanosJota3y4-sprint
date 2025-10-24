// src/pages/EliminarProducto.jsx
import { useState, useEffect } from "react";
import "../styles/pages/EliminarProducto.css";

const EliminarProducto = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [eliminandoId, setEliminandoId] = useState(null);

  // 🔹 Cargar productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        if (!res.ok) throw new Error("Error al cargar los productos");
        const data = await res.json();
        // Ordenar por nombre
        setProductos(data.data?.sort((a, b) => a.nombre.localeCompare(b.nombre)) || []);
      } catch (err) {
        setMensaje("❌ " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // 🔹 Eliminar un producto
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    setEliminandoId(id);
    setMensaje("");
    try {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error al eliminar el producto");
      }
      setProductos((prev) => prev.filter((p) => p._id !== id));
      setMensaje("✅ Producto eliminado correctamente");
    } catch (err) {
      setMensaje("❌ " + err.message);
    } finally {
      setEliminandoId(null);
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  if (loading) return <p className="loading">Cargando productos...</p>;

  return (
    <section className="eliminar-producto">
      <h2>🗑️ Eliminar Producto</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}

      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul className="lista-productos">
          {productos.map((p) => (
            <li key={p._id} className="producto-item">
              <div className="producto-info">
                {p.imagen && (
                  <img
                    src={`http://localhost:5000${p.imagen}`}
                    alt={p.nombre}
                    className="producto-img"
                  />
                )}
                <div className="producto-detalles">
                  <h3>{p.nombre}</h3>
                  <p>Precio: ${p.precio}</p>
                  <p>Categoría: {p.categoria}</p>
                  <p>Stock: {p.stock}</p>
                </div>
              </div>
              <button
                className="btn-eliminar"
                onClick={() => eliminarProducto(p._id)}
                disabled={eliminandoId === p._id}
              >
                {eliminandoId === p._id ? "Eliminando..." : "Eliminar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default EliminarProducto;
