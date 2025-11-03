import { useState } from "react";
import "../styles/pages/CrearProducto.css";

const CrearProducto = ({ crearProducto }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    destacado: false,
  });
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  // 🧭 URL base dinámica
  const API_BASE =
    (process.env.REACT_APP_API_URL || "https://hermanosjota3y4-sprint.onrender.com/api/productos").replace(/\/$/, "");

  // ===== Manejo de inputs =====
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (["nombre", "precio", "stock", "categoria"].includes(name)) {
      setErrores((prev) => ({
        ...prev,
        [name]: value.toString().trim() ? "" : "Campo obligatorio",
      }));
    }
  };

  // ===== Manejo de archivo =====
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // ===== Validación y envío =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    const nuevosErrores = {};

    ["nombre", "precio", "stock", "categoria"].forEach((key) => {
      if (!formData[key] || !formData[key].toString().trim()) {
        nuevosErrores[key] = "Campo obligatorio";
      }
    });

    if (Object.keys(nuevosErrores).length) {
      setErrores(nuevosErrores);
      return setMensaje("❌ Completa todos los campos obligatorios");
    }

    const precioNum = parseFloat(formData.precio);
    const stockNum = parseInt(formData.stock, 10);

    if (isNaN(precioNum) || precioNum < 0) return setMensaje("❌ Precio inválido");
    if (isNaN(stockNum) || stockNum < 0) return setMensaje("❌ Stock inválido");

    try {
      setLoading(true);

      const data = new FormData();
      data.append("nombre", formData.nombre.trim());
      data.append("descripcion", formData.descripcion.trim() || "");
      data.append("precio", String(precioNum));
      data.append("stock", String(stockNum));
      data.append("categoria", formData.categoria.trim());
      data.append("destacado", formData.destacado ? "true" : "false");
      if (imagen) data.append("imagen", imagen);

      // 🔹 Llamada al backend con URL base dinámica
      await crearProducto(data, API_BASE);

      setMensaje("✅ Producto creado con éxito");
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
        categoria: "",
        destacado: false,
      });
      setImagen(null);
      setPreview(null);
      setErrores({});
    } catch (err) {
      console.error(err);
      setMensaje("❌ Error al crear producto: " + (err.message || "desconocido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-producto">
      <h2>Crear Nuevo Producto</h2>

      {mensaje && (
        <p className={`mensaje ${mensaje.startsWith("✅") ? "exito" : "error"}`}>
          {mensaje}
        </p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
          {errores.nombre && <small className="error">{errores.nombre}</small>}
        </div>

        <div className="form-group">
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <input
            type="number"
            name="precio"
            placeholder="Precio"
            value={formData.precio}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
          {errores.precio && <small className="error">{errores.precio}</small>}
        </div>

        <div className="form-group">
          <input
            type="number"
            name="stock"
            placeholder="Stock disponible"
            value={formData.stock}
            onChange={handleChange}
            min="0"
          />
          {errores.stock && <small className="error">{errores.stock}</small>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="categoria"
            placeholder="Categoría"
            value={formData.categoria}
            onChange={handleChange}
          />
          {errores.categoria && <small className="error">{errores.categoria}</small>}
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="destacado"
            checked={formData.destacado}
            onChange={handleChange}
          />
          Producto destacado
        </label>

        <div className="form-group">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && <img src={preview} alt="Preview" className="preview-img" />}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear Producto"}
        </button>
      </form>
    </div>
  );
};

export default CrearProducto;
