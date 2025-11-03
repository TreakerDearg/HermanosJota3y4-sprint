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

  // ===============================
  // BASE API CONFIG
  // ===============================
  const API_BASE =
    process.env.REACT_APP_API_URL ||
    "https://hermanosjota3y4-sprint.onrender.com/api";

  // ===============================
  // CARGAR PRODUCTOS
  // ===============================
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setMensaje("");

        const res = await fetch(`${API_BASE}/productos`);
        if (!res.ok) throw new Error(`Error HTTP ${res.status}`);

        const data = await res.json();
        setProductos(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        console.error("❌ Error al obtener productos:", err);
        setMensaje("❌ No se pudieron cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [API_BASE]);

  // ===============================
  // CARGAR PRODUCTO SELECCIONADO
  // ===============================
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

  // ===============================
  // HANDLERS
  // ===============================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  // ===============================
  // SUBMIT ACTUALIZACIÓN
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedId) return setMensaje("❌ Selecciona un producto.");
    if (!formData.nombre || !formData.precio || !formData.stock || !formData.categoria)
      return setMensaje("❌ Completa todos los campos obligatorios.");

    try {
      setSubmitting(true);
      setMensaje("");

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );
      if (nuevaImagen) data.append("imagen", nuevaImagen);

      const res = await fetch(`${API_BASE}/productos/${selectedId}`, {
        method: "PUT",
        body: data,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error HTTP ${res.status}: ${text}`);
      }

      setMensaje("✅ Producto actualizado correctamente.");

      if (nuevaImagen && preview) {
        setImagenActual(preview);
        setPreview(null);
        setNuevaImagen(null);
      }
    } catch (err) {
      console.error("❌ Error en actualización:", err);
      setMensaje("❌ Error al actualizar: " + (err.message || "Error desconocido."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  return (
    <div className="editar-producto">
      <h2>Editar Producto</h2>
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
                src={
                  imagenActual.startsWith("http")
                    ? imagenActual
                    : `${API_BASE.replace("/api", "")}${imagenActual}`
                }
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
