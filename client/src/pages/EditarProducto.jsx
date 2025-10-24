// src/pages/EditarProducto.jsx
import { useState, useEffect } from "react";
import "../styles/pages/EditarProducto.css";

const EditarProducto = ({ actualizarProducto }) => {
  const [productos, setProductos] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    precio: "",
    stock: "",
    destacado: false,
  });
  const [imagenActual, setImagenActual] = useState(null);
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState("");

  // ===== Cargar productos desde API =====
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setMensaje("");
        const res = await fetch("http://localhost:5000/api/productos");
        if (!res.ok) throw new Error("Error al cargar los productos");
        const data = await res.json();
        setProductos(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        setMensaje("❌ " + (err.message || "Error desconocido"));
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  // ===== Cargar datos del producto seleccionado =====
  useEffect(() => {
    if (!selectedId) return;

    const producto = productos.find((p) => p._id === selectedId);
    if (producto) {
      setFormData({
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        categoria: producto.categoria || "",
        precio: producto.precio || "",
        stock: producto.stock || "",
        destacado: !!producto.destacado,
      });
      setImagenActual(producto.imagen || null);
      setPreview(null);
      setNuevaImagen(null);
      setMensaje("");
    }
  }, [selectedId, productos]);

  // ===== Manejo de inputs =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===== Manejo de imagen =====
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNuevaImagen(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // ===== Submit para actualizar producto =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) return setMensaje("❌ Selecciona un producto primero");
    if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoria) {
      return setMensaje("❌ Completa todos los campos obligatorios");
    }

    try {
      setSubmitting(true);
      setMensaje("");

      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (nuevaImagen) data.append("imagen", nuevaImagen);

      await actualizarProducto(selectedId, data);
      setMensaje("✅ Producto actualizado correctamente");

      // Actualizar imagen actual si se cambió
      if (nuevaImagen && preview) {
        setImagenActual(preview);
        setPreview(null);
        setNuevaImagen(null);
      }
    } catch (err) {
      setMensaje("❌ " + (err.message || "Error desconocido"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="editar-producto">
      <h2>Editar producto</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}

      <label htmlFor="producto-select">Selecciona un producto:</label>
      <select
        id="producto-select"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">-- Selecciona --</option>
        {productos.map((p) => (
          <option key={p._id} value={p._id}>
            {p.nombre}
          </option>
        ))}
      </select>

      {selectedId && (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
          />
          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={formData.categoria}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock disponible"
            value={formData.stock}
            onChange={handleChange}
            required
          />
          <label>
            <input
              type="checkbox"
              name="destacado"
              checked={formData.destacado}
              onChange={handleChange}
            />
            Producto destacado
          </label>

          {imagenActual && (
            <>
              <p>Imagen actual:</p>
              <img
                src={`http://localhost:5000${imagenActual}`}
                alt="Actual"
                className="preview-img"
              />
            </>
          )}

          <input type="file" accept="image/*" onChange={handleFileChange} />

          {preview && (
            <>
              <p>Preview nueva imagen:</p>
              <img src={preview} alt="Preview" className="preview-img" />
            </>
          )}

          <button type="submit" disabled={submitting}>
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>
        </form>
      )}
    </div>
  );
};

export default EditarProducto;
