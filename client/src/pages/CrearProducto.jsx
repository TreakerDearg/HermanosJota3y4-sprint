// src/pages/CrearProducto.jsx
import { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { 
  IoAddCircleOutline,
  IoPricetagOutline,
  IoCubeOutline,
  IoImageOutline,
  IoCreateOutline,
  IoAlertCircleOutline
} from "react-icons/io5";

import "../styles/pages/CrearProducto.css";

export default function CrearProducto() {
  const { crearProducto } = useProducts();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
    destacado: false,
  });

  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!user || user.rol !== "admin") navigate("/");
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    const data = { ...form, imagen };
    const res = await crearProducto(data);

    if (res?.estado === "success") {
      setMensaje("✔ Producto creado correctamente");
      setForm({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        stock: "",
        destacado: false,
      });
      setImagen(null);
      setPreview(null);
      setTimeout(() => navigate("/admin/productos"), 1200);
    } else {
      setMensaje("❌ " + (res?.mensaje || "Error al crear producto"));
    }
  };

  return (
    <div className="crear-producto">

      <h2 className="titulo-principal">
        <IoAddCircleOutline size={28} /> Crear Producto
      </h2>

      {mensaje && (
        <p className={`mensaje ${mensaje.startsWith("✔") ? "exito" : "error"}`}>
          <IoAlertCircleOutline /> {mensaje}
        </p>
      )}

      <form onSubmit={handleSubmit} className="form-crear">

        {/* DATOS BÁSICOS */}
        <div className="card">
          <h3><IoCreateOutline /> Datos Básicos</h3>
          <div className="fila-doble">
            <div className="campo">
              <label><IoPricetagOutline /> Nombre</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className="campo">
              <label><IoCubeOutline /> Categoría</label>
              <input type="text" name="categoria" value={form.categoria} onChange={handleChange} required />
            </div>
          </div>
          <div className="campo descripcion-field">
            <label>Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} />
          </div>
        </div>

        {/* INVENTARIO Y PRECIO */}
        <div className="card">
          <h3><IoPricetagOutline /> Inventario y Precio</h3>
          <div className="fila-doble">
            <div className="campo">
              <label>Precio ($)</label>
              <input type="number" name="precio" min="1" value={form.precio} onChange={handleChange} required />
            </div>
            <div className="campo">
              <label>Stock</label>
              <input type="number" name="stock" min="0" value={form.stock} onChange={handleChange} required />
            </div>
          </div>
          <label className="checkbox-field">
            <input type="checkbox" name="destacado" checked={form.destacado} onChange={handleChange} />
            Destacado
          </label>
        </div>

        {/* IMÁGENES */}
        <div className="card">
          <h3><IoImageOutline /> Imágenes</h3>
          <label>Subir imagen</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {preview && (
            <>
              <p>Vista previa:</p>
              <img src={preview} alt="preview" className="preview-img" />
            </>
          )}
        </div>

        <button type="submit" className="btn-crear">
          Crear Producto
        </button>

      </form>
    </div>
  );
}
