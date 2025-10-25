import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import ProductDetail from "../components/ProductDetail";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const Catalogo = ({ productos: initialProductos = [], agregarAlCarrito }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(!initialProductos.length);
  const [error, setError] = useState(null);

  // ===== Fetch productos si no vienen como prop =====
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/productos`);
        if (!res.ok) throw new Error("No se pudieron cargar los productos");
        const data = await res.json();

        const productosRaw = data.data ?? data;
        const productosConImagen = productosRaw.map(p => ({
          ...p,
          imagenUrl: p.imagenUrl ? `${API_BASE}${p.imagenUrl}` : null
        }));

        setProductos(productosConImagen);
      } catch (err) {
        console.error("❌ Error fetchProductos:", err);
        setError(err.message || "Error al cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    if (!initialProductos.length) fetchProductos();
    else {
      // Formatear imágenes si vienen props
      const productosConImagen = initialProductos.map(p => ({
        ...p,
        imagenUrl: p.imagenUrl ? `${API_BASE}${p.imagenUrl}` : null
      }));
      setProductos(productosConImagen);
      setLoading(false);
    }
  }, [initialProductos]);

  // ===== Selección dinámica del producto =====
  useEffect(() => {
    if (!id) {
      setProductoSeleccionado(null);
      return;
    }

    const prodLocal = productos.find(p => String(p._id) === id);
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
        const p = data.data ?? data;
        setProductoSeleccionado({
          ...p,
          imagenUrl: p.imagenUrl ? `${API_BASE}${p.imagenUrl}` : null
        });
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

  // ===== Navegación =====
  const verDetalle = (producto) => producto && navigate(`/productos/${producto._id}`);
  const volverAlCatalogo = () => {
    navigate("/productos");
    setProductoSeleccionado(null);
  };

  // ===== Render =====
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
