import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // ✅ nuevo
import ProductList from "../components/ProductList";
import ProductDetail from "../components/ProductDetail";

// ============================
// ✅ Configuración de API dinámica
// ============================
const API_BASE = (process.env.REACT_APP_API_URL || "https://hermanosjota3y4-sprint.onrender.com/api").replace(/\/$/, "");
const API_IMG = API_BASE.endsWith("/api") ? API_BASE.slice(0, -4) : API_BASE;

const Catalogo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Contexto del carrito
  const { agregarAlCarrito } = useCart();

  // ============================
  // 🔹 Estados locales
  // ============================
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================
  // 🔹 Helper para imagen URL segura
  // ============================
  const addImagenUrl = useCallback(
    (p) => ({
      ...p,
      imagenUrl: p.imagenUrl
        ? p.imagenUrl.replace(/\\/g, "/").startsWith("/uploads")
          ? `${API_IMG}${p.imagenUrl.replace(/\\/g, "/")}`
          : p.imagenUrl
        : "/images/placeholder.png",
    }),
    []
  );

  // ============================
  // 🔹 Fetch productos (listado)
  // ============================
  useEffect(() => {
    let isMounted = true;
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/productos`);
        if (!res.ok) throw new Error("No se pudieron cargar los productos");

        const data = await res.json();
        const productosRaw = data.data ?? data;
        if (isMounted) setProductos(productosRaw.map(addImagenUrl));
      } catch (err) {
        if (isMounted) setError(err.message || "Error al cargar los productos");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductos();
    return () => {
      isMounted = false;
    };
  }, [addImagenUrl]);

  // ============================
  // 🔹 Fetch producto individual
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

    let isMounted = true;
    const fetchProducto = async (prodId) => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/productos/${prodId}`);
        if (!res.ok) throw new Error("Producto no encontrado");

        const data = await res.json();
        if (isMounted) setProductoSeleccionado(addImagenUrl(data.data ?? data));
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Error al cargar el producto");
          setProductoSeleccionado(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducto(id);
    return () => {
      isMounted = false;
    };
  }, [id, productos, addImagenUrl]);

  // ============================
  // 🔹 Navegación
  // ============================
  const verDetalle = useCallback(
    (producto) => producto && navigate(`/productos/${producto._id}`),
    [navigate]
  );

  const volverAlCatalogo = useCallback(() => {
    navigate("/productos");
    setProductoSeleccionado(null);
  }, [navigate]);

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
