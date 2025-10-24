// src/pages/EliminarProducto.jsx
import { useState, useEffect } from "react";
import "../styles/pages/EliminarProducto.css";

function EliminarProducto() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");

  // 🔹 Cargar productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        if (!res.ok) throw new Error("Error al cargar los productos");
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // 🔹 Eliminar un producto específico
  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar el producto");

      setProductos((prev) => prev.filter((p) => p._id !== id));
      setMensaje("✅ Producto eliminado correctamente");
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al eliminar el producto");
    }

    // Ocultar mensaje después de 3s
    setTimeout(() => setMensaje(""), 3000);
  };

  if (loading) return <p className="loading">Cargando productos...</p>;

  return (
    <section className="eliminar-producto">
      <h2>🗑️ Eliminar Producto</h2>
      <p>Selecciona un producto de la lista para eliminarlo.</p>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul className="lista-productos">
          {productos.map((p) => (
            <li key={p._id} className="producto-item">
              <div className="producto-info">
                <img
                  src={`http://localhost:5000${p.imagen}`}
                  alt={p.nombre}
                  className="producto-img"
                />
                <div>
                  <h3>{p.nombre}</h3>
                  <p>${p.precio}</p>
                </div>
              </div>
              <button
                className="btn-eliminar"
                onClick={() => eliminarProducto(p._id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default EliminarProducto;
