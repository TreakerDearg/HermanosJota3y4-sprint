// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import productosRoutes from "./routes/productos.js";
import logger from "./middlewares/logger.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const API_PREFIX = process.env.API_PREFIX || "/api";

// ===== Middlewares globales =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// ===== Servir archivos estáticos =====
app.use("/uploads", express.static(path.join(process.cwd(), UPLOAD_DIR)));
app.use("/images", express.static(path.join(process.cwd(), "public/images")));

// ===== Rutas =====
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API de Hermanos Jota funcionando 🚀",
    timestamp: new Date().toISOString(),
  });
});

// Prefijo configurable para la API
app.use(`${API_PREFIX}/productos`, productosRoutes);

// ===== Middlewares de manejo de errores =====
app.use(notFoundHandler);
app.use(errorHandler);

// ===== Arranque de servidor y conexión a MongoDB =====
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log(`[${new Date().toISOString()}] ✅ Conectado a MongoDB`);

    app.listen(PORT, () =>
      console.log(`[${new Date().toISOString()}] 🚀 Servidor escuchando en http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error(`[${new Date().toISOString()}] ❌ Error al conectar MongoDB:`, err.message);
    process.exit(1);
  }
})();
