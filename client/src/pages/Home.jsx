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
  const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
  const API_IMG = API_BASE.replace(/\/api$/, ""); // elimina /api al final si existe

  // ===============================
  // 🔹 Productos destacados
  // ===============================
  const destacados = productos.filter((p) => p.destacado);

  // 🔹 Normalización de rutas de imágenes
  const productosConImagen = destacados.map((p) => {
    let imagenUrl = "/images/placeholder.png";

    if (p.imagenUrl) {
      if (p.imagenUrl.startsWith("http")) {
        imagenUrl = p.imagenUrl;
      } else if (p.imagenUrl.startsWith("/uploads")) {
        imagenUrl = `${API_IMG}${p.imagenUrl.replace(/\\/g, "/")}`;
      } else {
        imagenUrl = `${API_IMG}/uploads/${p.imagenUrl.replace(/\\/g, "/")}`;
      }
    }

    return { ...p, imagenUrl };
  });

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
