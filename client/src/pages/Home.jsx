import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import Destacados from "../components/Destacados";
import SobreNosotros from "../components/SobreNosotros";
import Newsletter from "../components/Newsletter";

const Home = ({ productos, agregarAlCarrito }) => {
  const navigate = useNavigate();

  // ===============================
  // 🔹 Configuración base de API e imágenes
  // ===============================
  const API_BASE =
    process.env.REACT_APP_API_URL ||
    "https://hermanosjota3y4-sprint.onrender.com/api";

  // Se eliminan duplicados de /api y se construye correctamente la URL de imagen
  const API_IMG = API_BASE.replace("/api", "");

  // ===============================
  // 🔹 Productos destacados
  // ===============================
  const destacados = productos.filter((p) => p.destacado);

  // 🔹 Normalización de rutas de imágenes
  const productosConImagen = destacados.map((p) => ({
    ...p,
    imagenUrl: p.imagenUrl
      ? p.imagenUrl.startsWith("http")
        ? p.imagenUrl
        : `${API_IMG}${p.imagenUrl.replace(/\\/g, "/")}`
      : "/images/placeholder.png",
  }));

  // 🔹 Navegación al detalle
  const verDetalle = (producto) => {
    if (!producto) return;
    navigate(`/productos/${producto._id}`);
  };

  // ===============================
  // 🔹 Render principal
  // ===============================
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
