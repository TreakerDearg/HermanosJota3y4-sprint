import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EditarProducto = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({ nombre: "", categoria: "", precio: "", stock: "" });

  useEffect(() => {
    const fetchProducto = async () => {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`);
      const data = await res.json();
      setFormData(data);
    };
    fetchProducto();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Error al actualizar el producto");
      alert("✅ Producto actualizado correctamente");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="editar-producto">
      <h2>Editar producto</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} required />
        <input type="number" name="precio" value={formData.precio} onChange={handleChange} required />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarProducto;
