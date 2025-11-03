import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import ProductDetail from "../components/ProductDetail";

// ============================
// ✅ Configuración de API dinámica
// ============================
// Limpia el posible /api final para construir correctamente las URLs de imagen
const API_BASE = (process.env.REACT_APP_API_URL || "https://hermanosjota3y4-sprint.onrender.com/api").replace(/\/$/, "");

// 🔧 Asegura que solo quite "/api" si realmente está al final
const API_IMG = API_BASE.endsWith("/api")
  ? API_BASE.slice(0, -4)
  : API_BASE;


const Catalogo = ({ productos: initialProductos = [], agregarAlCarrito }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(!initialProductos.length);
  const [error, setError] = useState(null);

  // ============================
  // 🔹 Helper para imagen URL segura
  // ============================
  const addImagenUrl = (p) => ({
    ...p,
    imagenUrl: p.imagenUrl
      ? p.imagenUrl.replace(/\\/g, "/").startsWith("/uploads")
        ? `${API_IMG}${p.imagenUrl.replace(/\\/g, "/")}`
        : p.imagenUrl
      : "/images/placeholder.png",
  });

  // ============================
  // 🔹 Fetch de productos (listado)
  // ============================
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/productos`);
        if (!res.ok) throw new Error("No se pudieron cargar los productos");

        const data = await res.json();
        const productosRaw = data.data ?? data;
        setProductos(productosRaw.map(addImagenUrl));
      } catch (err) {
        console.error("❌ Error fetchProductos:", err);
        setError(err.message || "Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    if (!initialProductos.length) fetchProductos();
    else setProductos(initialProductos.map(addImagenUrl));
  }, [initialProductos]);

  // ============================
  // 🔹 Fetch de producto individual
  // ============================
  useEffect(() => {
    if (!id) {
      setProductoSeleccionado(null);
      return;
    }

    const prodLocal = productos.find((p) => String(p._id) === id);
    if (prodLocal) {
      setProductoSeleccionado(prodLocal);
      return;
    }

    const fetchProducto = async (prodId) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/productos/${prodId}`);
        if (!res.ok) throw new Error("Producto no encontrado");

        const data = await res.json();
        setProductoSeleccionado(addImagenUrl(data.data ?? data));
      } catch (err) {
        console.error("❌ Error fetchProducto:", err);
        setError(err.message || "Error al cargar el producto");
        setProductoSeleccionado(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto(id);
  }, [id, productos]);

  // ============================
  // 🔹 Navegación
  // ============================
  const verDetalle = (producto) => producto && navigate(`/productos/${producto._id}`);
  const volverAlCatalogo = () => {
    navigate("/productos");
    setProductoSeleccionado(null);
  };

  // ============================
  // 🔹 Renderizado
  // ============================
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>❌ {error}</p>;
  if (!productos.length) return <p>No hay productos disponibles</p>;

  return productoSeleccionado ? (
    <ProductDetail
      producto={productoSeleccionado}
      agregarAlCarrito={agregarAlCarrito}
      volver={volverAlCatalogo}
    />
  ) : (
    <ProductList
      productos={productos}
      agregarAlCarrito={agregarAlCarrito}
      verDetalle={verDetalle}
      titulo="Catálogo de Productos"
    />
  );
};

export default Catalogo;
