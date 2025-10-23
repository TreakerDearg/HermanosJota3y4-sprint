import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import ProductDetail from "../components/ProductDetail";

const Catalogo = ({ productos = [], agregarAlCarrito, loading }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    console.log(" useEffect Catalogo - id:", id);
    console.log(" Productos disponibles:", productos);

    if (id && productos.length > 0) {
      const prod = productos.find(p => String(p._id) === id);
      console.log("🔍 Producto seleccionado:", prod);
      setProductoSeleccionado(prod || null);
    } else {
      setProductoSeleccionado(null);
    }
  }, [id, productos]);

  const verDetalle = (producto) => {
    console.log("➡️ Ver detalle producto:", producto);
    if (!producto) return;
    navigate(`/productos/${producto._id}`);
  };

  const volverAlCatalogo = () => {
    console.log("⬅️ Volver al catálogo");
    navigate("/productos");
    setProductoSeleccionado(null);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (!productos || productos.length === 0) return <p>No hay productos disponibles</p>;

  return productoSeleccionado ? (
    <>
      {console.log("🎯 Renderizando ProductDetail:", productoSeleccionado)}
      <ProductDetail
        producto={productoSeleccionado}
        agregarAlCarrito={agregarAlCarrito}
        volver={volverAlCatalogo}
      />
    </>
  ) : (
    <>
      {console.log(" Renderizando ProductList")}
      <ProductList
        productos={productos}
        agregarAlCarrito={agregarAlCarrito}
        verDetalle={verDetalle}
        titulo="Catálogo de Productos"
      />
    </>
  );
};

export default Catalogo;
