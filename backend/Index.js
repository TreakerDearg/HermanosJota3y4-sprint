import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";

import productosRoutes from "./routes/productos.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import logger from "./middlewares/logger.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import { connectDB } from "./db.js";

dotenv.config();

// ==============================
// Validación de variables env
// ==============================
if (!process.env.MONGO_URI) throw new Error("❌ MONGO_URI no definido en .env");
if (!process.env.JWT_SECRET) throw new Error("❌ JWT_SECRET no definido en .env");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5000;
const app = express();

// ==============================
// Seguridad
// ==============================
app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// ==============================
// Rate limit
// ==============================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300,
  message: { estado: "error", mensaje: "Demasiadas peticiones. Intenta más tarde." },
});

app.use("/api/auth", apiLimiter);
app.use("/api/users", apiLimiter);
app.use("/api/productos", apiLimiter);

// ==============================
// CORS dinámico
// ==============================
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const vercelPreviewPattern = /^https:\/\/hermanos-jota3y4-sprint-[a-z0-9-]+-treakerdeargs-projects\.vercel\.app$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === FRONTEND_URL || origin === "null" || vercelPreviewPattern.test(origin)) {
        return callback(null, true);
      }
      console.error("❌ CORS bloqueado desde:", origin);
      return callback(new Error("CORS no permitido: " + origin));
    },
    credentials: true,
  })
);

// ==============================
// Middlewares base
// ==============================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV !== "production") {
  app.use(logger);
}

// ==============================
// Carpeta uploads (solo local)
// ==============================
if (process.env.NODE_ENV !== "production") {
  const UPLOAD_DIR = path.join(__dirname, "uploads");
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  app.use("/uploads", express.static(UPLOAD_DIR));
}

// ==============================
// Health check
// ==============================
app.get("/api/health", (req, res) => {
  res.status(200).json({
    estado: "success",
    mensaje: "API Hermanos Jota activa",
    entorno: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ==============================
// Función para listar rutas de un router
// ==============================
function listarRutas(router, prefijo = "") {
  const rutas = [];

  router.stack.forEach((middleware) => {
    if (middleware.route) {
      const metodos = Object.keys(middleware.route.methods).map(m => m.toUpperCase());
      rutas.push({
        ruta: prefijo + middleware.route.path,
        metodos,
      });
    } else if (middleware.name === "router") {
      rutas.push(...listarRutas(middleware.handle, prefijo));
    }
  });

  return rutas;
}

// ==============================
// Montar routers
// ==============================
app.use("/api/productos", productosRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// ==============================
// Endpoint automático /api
// ==============================
app.get("/api", (req, res) => {
  const rutas = [
    { ruta: "/api/health", metodos: ["GET"] },
    ...listarRutas(productosRoutes, "/api/productos"),
    ...listarRutas(authRoutes, "/api/auth"),
    ...listarRutas(userRoutes, "/api/users"),
  ];

  res.status(200).json({
    estado: "success",
    mensaje: "API Hermanos Jota activa",
    rutas_disponibles: rutas,
    timestamp: new Date().toISOString(),
  });
});

// ==============================
// Manejo de errores
// ==============================
app.use(notFoundHandler);
app.use(errorHandler);

// ==============================
// Inicio del servidor
// ==============================
const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("✅ MongoDB conectado");

    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  } catch (err) {
    console.error("❌ Error al iniciar:", err);
    process.exit(1);
  }
};

startServer();
