// index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

import productosRoutes from "./routes/productos.js";
import logger from "./middlewares/logger.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ============================
// 📁 Configurar ruta de uploads
// ============================
const UPLOAD_DIR =
  process.env.NODE_ENV === "production"
    ? path.join(os.tmpdir(), "uploads")
    : path.join(__dirname, "uploads");

// Crear carpeta si no existe (solo en dev)
import fs from "fs";
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`[Storage] Carpeta de uploads creada en: ${UPLOAD_DIR}`);
}

// ============================
// 🌐 CORS
// ============================
const allowedOrigins = [
  "https://hermanos-jota3y4-sprint-67f0a19p6-treakerdeargs-projects.vercel.app",
  "https://hermanosjota3y4.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const vercelPattern = /^https:\/\/hermanos-jota3y4-sprint-[a-z0-9-]+-treakerdeargs-projects\.vercel\.app$/;
      if (allowedOrigins.includes(origin) || vercelPattern.test(origin)) {
        return callback(null, true);
      }
      console.error("❌ Bloqueado por CORS:", origin);
      callback(new Error("CORS no autorizado"));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ============================
// 🧩 Middlewares base
// ============================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(logger);

// ============================
// 📂 Archivos estáticos
// ============================
app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// ============================
// 🚀 Rutas base
// ============================

app.get("/", (req, res) => {
  res.status(200).json({
    estado: "success",
    mensaje: "API de Hermanos Jota funcionando 🚀",
    entorno: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

app.use("/productos", productosRoutes);

// ============================
// ⚠️ Errores globales
// ============================
app.use(notFoundHandler);
app.use(errorHandler);

// ============================
// 🧠 Conexión DB + arranque
// ============================
const startServer = async () => {
  try {
    await connectDB(MONGO_URI);
    console.log(`[${new Date().toISOString()}] ✅ Conectado a MongoDB`);

    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`\n Recibida señal ${signal}. Cerrando servidor...`);
      server.close(() => {
        console.log("🛑 Servidor cerrado correctamente");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error(`❌ Error al iniciar servidor: ${err.message}`);
    process.exit(1);
  }
};

startServer();
