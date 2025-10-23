import express from "express";
import cors from "cors";
import logger from "./middlewares/logger.js";
import productosRoutes from "./routes/productos.js"; 
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // carga las variables de entorno

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/images", express.static("public/images"));

// Ruta raíz
app.get("/", (req, res) => {
  console.log(`[INFO] ${req.method} ${req.originalUrl} accedida desde ${req.ip}`);
  res.status(200).json({ estado: "success", mensaje: "API de Hermanos Jota funcionando 🚀" });
});

// Rutas de productos
app.use("/api/productos", productosRoutes);

// Middleware para rutas no encontradas (404)
app.use(notFoundHandler);
// Middleware global de errores
app.use(errorHandler);

// Conexión a MongoDB y arranque del servidor
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Conectado a MongoDB Atlas");
    app.listen(PORT, () => console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`));
  })
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));
