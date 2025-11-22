import express from "express";
import {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productController.js";

import { upload } from "../middlewares/uploadCloudinary.js"; // ← Nuevo middleware
import { authGuard } from "../middlewares/authGuard.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();

// ==============================
// 🔹 Ruta de prueba
// ==============================
router.get("/health", (req, res) =>
  res.status(200).json({
    estado: "ok",
    mensaje: "Ruta /api/productos operativa ✅",
    metodo: req.method,
    timestamp: new Date().toISOString(),
  })
);

// ==============================
// 🛒 CRUD PRODUCTOS
// ==============================

// GET: Todos los productos → abierto a todos
router.get("/", asyncHandler(getProductos));

// GET: Producto por ID → abierto a todos
router.get("/:id", asyncHandler(getProducto));

// ==============================
// Middleware para verificar rol admin
// ==============================
const requireAdmin = (req, res, next) => {
  if (req.user?.rol !== "admin") {
    return res.status(403).json({
      estado: "error",
      mensaje: "Solo los administradores pueden realizar esta acción",
    });
  }
  next();
};

// POST: Crear producto → solo admin
router.post(
  "/",
  authGuard,
  requireAdmin,
  upload.single("imagen"), // ← Cloudinary
  asyncHandler(createProducto)
);

// PUT: Actualizar producto → solo admin
router.put(
  "/:id",
  authGuard,
  requireAdmin,
  upload.single("imagen"), // ← Cloudinary
  asyncHandler(updateProducto)
);

// DELETE: Eliminar producto → solo admin
router.delete(
  "/:id",
  authGuard,
  requireAdmin,
  asyncHandler(deleteProducto)
);

export default router;
