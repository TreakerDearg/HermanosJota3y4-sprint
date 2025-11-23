import { useProducts } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { IoCreateOutline, IoTrashOutline, IoAddCircleOutline, IoStar } from "react-icons/io5";
import { useState, useMemo } from "react";
import "../styles/pages/ProductosAdmin.css";

export default function ProductosAdmin() {
  const { productos, loading } = useProducts();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("all");
  const [orden, setOrden] = useState("nombre");
  const [pagina, setPagina] = useState(1);
  const [mostrarDestacados, setMostrarDestacados] = useState(false);
  const [hoverProducto, setHoverProducto] = useState(null);

  const ITEMS_POR_PAGINA = 5;

  const productosFiltrados = useMemo(() => {
    let result = productos;

    if (mostrarDestacados) {
      result = result.filter(p => p.destacado);
    } else if (categoriaFiltro !== "all") {
      result = result.filter(p => p.categoria === categoriaFiltro);
    }

    if (busqueda.trim() !== "") {
      result = result.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (orden === "precio") return a.precio - b.precio;
      if (orden === "stock") return a.stock - b.stock;
      return a.nombre.localeCompare(b.nombre);
    });

    return result;
  }, [productos, busqueda, categoriaFiltro, orden, mostrarDestacados]);

  const totalPaginas = Math.ceil(productosFiltrados.length / ITEMS_POR_PAGINA);
  const productosPagina = productosFiltrados.slice(
    (pagina - 1) * ITEMS_POR_PAGINA,
    pagina * ITEMS_POR_PAGINA
  );

  const categorias = useMemo(() => {
    const cats = new Set(productos.map(p => p.categoria).filter(Boolean));
    return Array.from(cats);
  }, [productos]);

  if (loading) return <p className="loading">Cargando productos...</p>;

  return (
    <div className="productos-admin">
      <header className="admin-header">
        <h2>Panel de Productos</h2>
        <button className="btn-crear" onClick={() => navigate("/admin/crear-producto")}>
          <IoAddCircleOutline size={20} /> Crear Producto
        </button>
      </header>

      {/* Filtros y búsqueda */}
      <div className="admin-filtros">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)}>
          <option value="all">Todas las categorías</option>
          {categorias.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={orden} onChange={e => setOrden(e.target.value)}>
          <option value="nombre">Ordenar por nombre</option>
          <option value="precio">Ordenar por precio</option>
          <option value="stock">Ordenar por stock</option>
        </select>

        <button
          className={`btn-destacado ${mostrarDestacados ? "active" : ""}`}
          onClick={() => setMostrarDestacados(d => !d)}
        >
          <IoStar size={18} /> Destacados
        </button>
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="sin-productos">No hay productos que coincidan.</p>
      ) : (
        <>
          <div className="tabla-wrapper">
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
                {productosPagina.map(p => (
                  <tr
                    key={p._id}
                    onMouseEnter={() => setHoverProducto(p)}
                    onMouseLeave={() => setHoverProducto(null)}
                  >
                    <td>{p.nombre}</td>
                    <td>{p.categoria || "-"}</td>
                    <td>${p.precio.toLocaleString("es-AR")}</td>
                    <td className={p.stock <= 5 ? "stock-bajo" : ""}>{p.stock}</td>
                    <td className="destacado">
                      {p.destacado ? <IoStar color="#ffd700" /> : "-"}
                    </td>
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
          </div>

          {/* Vista rápida */}
          {hoverProducto && (
            <div className="vista-rapida">
              <h4>{hoverProducto.nombre}</h4>
              <img src={hoverProducto.imagenUrl || "/images/placeholder.png"} alt={hoverProducto.nombre} />
              <p>{hoverProducto.descripcion || "Sin descripción"}</p>
              <p>Precio: ${hoverProducto.precio.toLocaleString("es-AR")}</p>
              <p>Stock: {hoverProducto.stock}</p>
            </div>
          )}

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="paginacion">
              <button onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>
                {"<"}
              </button>
              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  className={pagina === i + 1 ? "active" : ""}
                  onClick={() => setPagina(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>
                {">"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
