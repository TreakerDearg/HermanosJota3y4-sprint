// src/pages/ProductosAdmin.jsx
import { useProducts } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { IoCreateOutline, IoTrashOutline, IoAddCircleOutline } from "react-icons/io5";
import "../styles/pages/ProductosAdmin.css";

export default function ProductosAdmin() {
  const { productos, loading } = useProducts();
  const navigate = useNavigate();

  if (loading) return <p className="loading">Cargando productos...</p>;

  return (
    <div className="productos-admin">
      <header className="admin-header">
        <h2>Panel de Productos</h2>
        <button
          className="btn-crear"
          onClick={() => navigate("/admin/crear-producto")}
        >
          <IoAddCircleOutline size={20} /> Crear Producto
        </button>
      </header>

      {productos.length === 0 ? (
        <p className="sin-productos">No hay productos disponibles.</p>
      ) : (
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p._id}>
                <td>{p.nombre}</td>
                <td>{p.categoria || "-"}</td>
                <td>${p.precio}</td>
                <td>{p.stock}</td>
                <td>{p.destacado ? "✔" : "✖"}</td>
                <td className="acciones">
                  <button
                    className="btn-editar"
                    onClick={() => navigate(`/admin/editar-producto/${p._id}`)}
                  >
                    <IoCreateOutline size={18} /> Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => navigate("/admin/eliminar-producto")}
                  >
                    <IoTrashOutline size={18} /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
