import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/components/EditarProducto.css";

const EditarProducto = ({ productos = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    destacado: false,
    imagen: "",
  });

  const [loading, setLoading] = useState(true);

  // Cargar datos del producto existente
  useEffect(() => {
    const prod = productos.find((p) => String(p._id) === id);
    if (prod) {
      setProducto(prod);
      setLoading(false);
    } else {
      const fetchProducto = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/productos/${id}`);
          if (!res.ok) throw new Error("Error al obtener el producto");
          const data = await res.json();
          setProducto(data);
        } catch (error) {
          alert("❌ Error al cargar producto: " + error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProducto();
    }
  }, [id, productos]);

  // Manejar cambios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!producto.nombre || !producto.precio) {
      alert("⚠️ El nombre y el precio son obligatorios");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      if (!res.ok) throw new Error("Error al actualizar producto");
      alert("✅ Producto actualizado correctamente");
      navigate("/productos");
    } catch (error) {
      alert("❌ Error al actualizar producto: " + error.message);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Cargando producto...</p>;

  return (
    <section className="editar-producto">
      <h2>✏️ Editar Producto</h2>

      <form className="editar-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
            placeholder="Ej: Mesa de Roble"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            placeholder="Describe el producto..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            id="precio"
            name="precio"
            type="number"
            value={producto.precio}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoría:</label>
          <input
            id="categoria"
            name="categoria"
            value={producto.categoria}
            onChange={handleChange}
            placeholder="Ej: Mesas, Sillas, Estantes..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagen">URL Imagen:</label>
          <input
            id="imagen"
            name="imagen"
            value={producto.imagen}
            onChange={handleChange}
            placeholder="/uploads/mueble.png"
          />
        </div>

        <div className="checkbox-group">
          <label htmlFor="destacado">Destacado:</label>
          <input
            id="destacado"
            name="destacado"
            type="checkbox"
            checked={producto.destacado}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-guardar">
            💾 Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => navigate("/productos")}
            className="btn-cancelar"
          >
            🔙 Cancelar
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditarProducto;
