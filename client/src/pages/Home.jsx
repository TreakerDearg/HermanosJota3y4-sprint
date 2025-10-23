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

  return (
    <main>
      <HeroBanner />
      <Destacados
        productos={destacados}
        verDetalle={verDetalle}
        agregarAlCarrito={agregarAlCarrito}
      />
      <SobreNosotros />
      <Newsletter />
    </main>
  );
};

export default Home;
