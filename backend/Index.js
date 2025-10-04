import express from "express";
import cors from "cors";
import logger from "./middlewares/logger.js";
import productosRoutes from "./routes/productos.js"; 
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Logger mejorado que usa req
app.use(logger);

// Ruta raíz
app.get("/", (req, res) => {
  // Aquí usamos req para mostrar información opcional
  console.log(`[INFO] ${req.method} ${req.originalUrl} accedida`);
  res.status(200).json({ estado: "success", mensaje: "API de Hermanos Jota funcionando 🚀" });
});

// Rutas de productos
app.use("/api/productos", productosRoutes);

// Middleware para rutas no encontradas (404)
app.use(notFoundHandler);

// Middleware global de errores
app.use(errorHandler);

// Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor backend escuchando en http://localhost:${PORT}`);
});
