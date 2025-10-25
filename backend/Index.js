// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import productosRoutes from "./routes/productos.js";
import logger from "./middlewares/logger.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import { connectDB } from "./db.js";

// ============================
// 🔧 Configuración base
// ============================
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";
const API_PREFIX = process.env.API_PREFIX || "/api";

// Validación mínima de entorno
if (!MONGO_URI) {
  console.error(" FALTA VARIABLE DE ENTORNO: MONGO_URI");
  process.exit(1);
}

// ============================
//  Middlewares globales
// ============================
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(logger);

// ============================
//  Archivos estáticos
// ============================
app.use("/uploads", express.static(path.join(__dirname, UPLOAD_DIR)));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ============================
//  Rutas base
// ============================
app.get("/", (req, res) => {
  res.status(200).json({
    estado: "success",
    mensaje: "API de Hermanos Jota funcionando 🚀",
    entorno: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use(`${API_PREFIX}/productos`, productosRoutes);

// ============================
//  Manejo de errores
// ============================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================
//  Conexión DB + arranque
// ============================
const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    console.log(`[${new Date().toISOString()}]  Conectado a MongoDB`);

    const server = app.listen(PORT, () => {
      console.log(`[${new Date().toISOString()}]  Servidor escuchando en http://localhost:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n🧹 Recibida señal ${signal}. Cerrando servidor...`);
      server.close(() => {
        console.log("🛑 Servidor cerrado correctamente");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error(`[${new Date().toISOString()}]  Error al iniciar servidor: ${err.message}`);
    process.exit(1);
  }
};

// Iniciar aplicación
startServer();
