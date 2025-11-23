// src/pages/EditarProducto.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";

import {
  IoSettingsOutline,
  IoCreateOutline,
  IoPricetagOutline,
  IoCubeOutline,
  IoImageOutline,
  IoSaveOutline,
  IoAlertCircleOutline,
  IoFileTrayStackedOutline,
  IoDocumentTextOutline
} from "react-icons/io5";

import "../styles/pages/EditarProducto.css";

export default function EditarProducto() {
  const { id: idURL } = useParams();
  const navigate = useNavigate();

  const {
    productos,
    fetchProductos,
    getProductoById,
    actualizarProducto,
    loading: loadingProductos
  } = useProducts();

  const [idSeleccionado, setIdSeleccionado] = useState(idURL || "");

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
    destacado: false,
  });

  const [imagenActual, setImagenActual] = useState(null);
  const [imagenNueva, setImagenNueva] = useState(null);
  const [preview, setPreview] = useState(null);

  const [mensaje, setMensaje] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Cargar productos si aún no están
  useEffect(() => {
    if (!productos || productos.length === 0) {
      fetchProductos();
    }
  }, [productos, fetchProductos]);

  // Cargar producto seleccionado
  useEffect(() => {
    if (!idSeleccionado) return;

    const prod = getProductoById(idSeleccionado);
    if (!prod) return;

    setForm({
      nombre: prod.nombre || "",
      descripcion: prod.descripcion || "",
      precio: prod.precio || "",
      categoria: prod.categoria || "",
      stock: prod.stock || "",
      destacado: prod.destacado || false,
    });

    // 🔥 Imagen actual correcta desde Cloudinary
    setImagenActual(prod.imagenUrl || null);

    // Reset subida
    setImagenNueva(null);
    setPreview(null);

    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idSeleccionado, productos, getProductoById]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMensaje("❌ Solo se permiten imágenes.");
      return;
    }

    setImagenNueva(file);

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const validarFormulario = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    if (!form.categoria.trim()) return "La categoría es obligatoria.";
    if (form.precio <= 0) return "El precio debe ser mayor a 0.";
    if (form.stock < 0) return "El stock no puede ser negativo.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const error = validarFormulario();
    if (error) {
      setMensaje("❌ " + error);
      return;
    }

    setSubmitting(true);

    const data = {
      ...form,
      imagen: imagenNueva || undefined,  // 🔥 Solo enviar imagen si hay nueva
    };

    const res = await actualizarProducto(idSeleccionado, data);

    if (res?.estado === "success") {
      setMensaje("✔ Producto actualizado correctamente");
      setTimeout(() => navigate("/admin/productos"), 1200);
    } else {
      setMensaje("❌ Error: " + (res?.mensaje || "No se pudo actualizar"));
    }

    setSubmitting(false);
  };

  if (loadingProductos) {
    return <p className="loading">Cargando productos...</p>;
  }

  return (
    <div className="editar-producto">
      <h2 className="titulo-principal">
        <IoSettingsOutline size={28} /> Panel de Edición de Producto
      </h2>

      {mensaje && (
        <p className={`mensaje ${mensaje.startsWith("✔") ? "exito" : "error"}`}>
          <IoAlertCircleOutline /> {mensaje}
        </p>
      )}

      {/* SELECCIONAR PRODUCTO */}
      <div className="card card-seleccion">
        <label><IoFileTrayStackedOutline /> Seleccionar Producto</label>

        <select
          value={idSeleccionado}
          onChange={(e) => setIdSeleccionado(e.target.value)}
          className="selector-productos"
        >
          <option value="">-- Elegir producto --</option>

          {productos.map((prod) => (
            <option key={prod._id} value={prod._id}>
              {prod.nombre} {prod.categoria && `(${prod.categoria})`}
            </option>
          ))}
        </select>

        {!idSeleccionado && (
          <p className="tip">Selecciona un producto para comenzar.</p>
        )}
      </div>

      {/* FORMULARIO */}
      {idSeleccionado && (
        <form onSubmit={handleSubmit} className="form-editar">

          {/* DATOS BÁSICOS */}
          <div className="card">
            <h3><IoCreateOutline /> Datos Básicos</h3>

            <div className="fila-doble">
              <div className="campo">
                <label><IoPricetagOutline /> Nombre</label>
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label><IoCubeOutline /> Categoría</label>
                <input
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="campo descripcion-field">
              <label><IoDocumentTextOutline /> Descripción del Producto</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Escribe la descripción completa del producto..."
              />
            </div>
          </div>

          {/* INVENTARIO Y PRECIO */}
          <div className="card">
            <h3><IoPricetagOutline /> Inventario y Precio</h3>

            <div className="fila-doble">
              <div className="campo">
                <label>Precio ($)</label>
                <input
                  type="number"
                  name="precio"
                  min="1"
                  value={form.precio}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="campo">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <label className="checkbox-field">
              <input
                type="checkbox"
                name="destacado"
                checked={form.destacado}
                onChange={handleChange}
              />
              Producto destacado
            </label>
          </div>

          {/* IMÁGENES */}
          <div className="card imagenes-field">
            <h3><IoImageOutline /> Imágenes</h3>

            <div className="imagenes-container">

              <div className="imagen-actual">
                <label>Imagen Actual</label>
                {imagenActual ? (
                  <img src={imagenActual} alt="actual" className="preview-img" />
                ) : (
                  <p>No tiene imagen</p>
                )}
              </div>

              <div className="imagen-nueva">
                <label>Subir nueva imagen</label>
                <input type="file" accept="image/*" onChange={handleImage} />

                {preview && (
                  <>
                    <p>Vista previa:</p>
                    <img src={preview} alt="preview" className="preview-img" />
                  </>
                )}
              </div>

            </div>
          </div>

          <button
            type="submit"
            className="btn-guardar"
            disabled={submitting}
          >
            <IoSaveOutline size={20} />{" "}
            {submitting ? "Guardando..." : "Guardar Cambios"}
          </button>

        </form>
      )}
    </div>
  );
}
