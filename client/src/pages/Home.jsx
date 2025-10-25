import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Destacados from "../components/Destacados";
import SobreNosotros from "../components/SobreNosotros";
import Newsletter from "../components/Newsletter";

const Home = ({ productos, agregarAlCarrito }) => {
  const navigate = useNavigate();

  // Filtrar productos destacados
  const destacados = productos.filter((p) => p.destacado);

  // Función para ver detalle desde los destacados
  const verDetalle = (producto) => {
    if (!producto) return;
    navigate(`/productos/${producto._id}`);
  };

  // Agregar URL completa de la imagen si existe
  const productosConImagen = destacados.map((p) => ({
    ...p,
    imagenUrl: p.imagenUrl
      ? `${process.env.REACT_APP_API_BASE || "http://localhost:5000"}${p.imagenUrl}`
      : null,
  }));

  return (
    <main>
      <HeroBanner />
      <Destacados
        productos={productosConImagen}
        verDetalle={verDetalle}
        agregarAlCarrito={agregarAlCarrito}
      />
      <SobreNosotros />
      <Newsletter />
    </main>
  );
};

export default Home;
