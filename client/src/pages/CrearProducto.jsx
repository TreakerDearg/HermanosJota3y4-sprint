import { useState } from "react";

const CrearProducto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
    destacado: false,
    categoria: "",
    stock: "",
  });

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
      const res = await fetch("http://localhost:5000/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al crear el producto");

      alert("✅ Producto creado con éxito");
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        imagen: "",
        destacado: false,
        categoria: "",
        stock: "",
      });
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <div className="crear-producto">
      <h2>Crear nuevo producto</h2>
      <form onSubmit={handleSubmit}>
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
        <input
          type="text"
          name="imagen"
          placeholder="URL o ruta de la imagen"
          value={formData.imagen}
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
        <label>
          <input
            type="checkbox"
            name="destacado"
            checked={formData.destacado}
            onChange={handleChange}
          />
          Producto destacado
        </label>
        <button type="submit">Crear Producto</button>
      </form>
    </div>
  );
};

export default CrearProducto;
