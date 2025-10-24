import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import ProductDetail from "../components/ProductDetail";

const Catalogo = ({ productos: initialProductos = [], agregarAlCarrito }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productos, setProductos] = useState(initialProductos);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(!initialProductos.length);
  const [error, setError] = useState(null);

  // ===== Fetch productos si no vienen como prop =====
  useEffect(() => {
    if (initialProductos.length === 0) {
      const fetchProductos = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch("http://localhost:5000/api/productos");
          if (!res.ok) throw new Error("No se pudieron cargar los productos");
          const data = await res.json();
          setProductos(data.data || []);
        } catch (err) {
          console.error("❌ Error fetchProductos:", err);
          setError(err.message || "Error al cargar los productos");
        } finally {
          setLoading(false);
        }
      };
      fetchProductos();
    }
  }, [initialProductos]);

  // ===== Selección dinámica del producto =====
  useEffect(() => {
    if (!id) {
      setProductoSeleccionado(null);
      return;
    }

    // Buscar localmente primero
    const prodLocal = productos.find(p => String(p._id) === id);
    if (prodLocal) {
      setProductoSeleccionado(prodLocal);
      return;
    }

    // Si no está local, fetch individual
    const fetchProducto = async (prodId) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/productos/${prodId}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProductoSeleccionado(data.data);
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
  const verDetalle = (producto) => {
    if (!producto) return;
    navigate(`/productos/${producto._id}`);
  };

  const volverAlCatalogo = () => {
    navigate("/productos");
    setProductoSeleccionado(null);
  };

  // ===== Render =====
  if (loading) return <p>Cargando...</p>;
  if (error) return <p>❌ {error}</p>;
  if (!productos || productos.length === 0) return <p>No hay productos disponibles</p>;

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
