// src/pages/CrearProducto.jsx
import { useState } from "react";
import axios from "axios";
import "../styles/pages/CrearProducto.css";

function CrearProducto() {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    destacado: false,
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/productos", formData);
      setMensaje("✅ Producto creado correctamente");
      console.log("Producto creado:", response.data);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: "",
        destacado: false,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      setMensaje("❌ Error al crear el producto");
    }
  };

  return (
    <section className="crear-producto">
      <h2>🛠️ Crear Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </label>

        <label>
          Descripción:
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />
        </label>

        <label>
          Precio:
          <input type="number" name="precio" value={formData.precio} onChange={handleChange} required />
        </label>

        <label>
          URL de imagen:
          <input type="text" name="imagen" value={formData.imagen} onChange={handleChange} required />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            name="destacado"
            checked={formData.destacado}
            onChange={handleChange}
          />
          Producto destacado
        </label>

        <button type="submit" className="btn-crear">Crear producto</button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </section>
  );
}

export default CrearProducto;
