import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Destacados from "../components/Destacados";
import SobreNosotros from "../components/SobreNosotros";
import Newsletter from "../components/Newsletter";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

export default function Home() {
  const navigate = useNavigate();
  const { productos } = useProducts();
  const { addToCart } = useCart();

  // Filtrar productos destacados de forma segura
  const destacados = Array.isArray(productos)
    ? productos.filter((p) => p.destacado)
    : [];

  // Función para navegar al detalle de un producto
  const verDetalle = (producto) => {
    if (!producto?._id) return;
    navigate(`/productos/${producto._id}`);
  };

  return (
    <main>
      {/* Banner principal */}
      <HeroBanner />

      {/* Productos destacados */}
      <Destacados
        productos={destacados}
        verDetalle={verDetalle}
        agregarAlCarrito={addToCart}
      />

      {/* Secciones informativas */}
      <SobreNosotros />
      <Newsletter />
    </main>
  );
}
