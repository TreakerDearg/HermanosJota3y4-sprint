import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productosRoutes from "./routes/productos.js";
import logger from "./middlewares/logger.js";
import { notFoundHandler, errorHandler } from "./middlewares/errorHandler.js";
import { connectDB } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(logger);
app.use("/images", express.static("public/images"));

// Rutas
app.get("/", (req, res) => {
  res.status(200).json({ estado: "success", mensaje: "API de Hermanos Jota funcionando 🚀" });
});

app.use("/api/productos", productosRoutes);

// Middlewares de error
app.use(notFoundHandler);
app.use(errorHandler);

// Conexión a MongoDB y arranque
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`));
});
