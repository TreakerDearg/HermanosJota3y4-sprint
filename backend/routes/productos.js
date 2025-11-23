// routes/productos.js
import express from "express";
import {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productController.js";

import { upload, handleUploadErrors } from "../middlewares/uploadCloudinary.js";
import { authGuard } from "../middlewares/authGuard.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const router = express.Router();

/* =======================================================
   🔹 Health Check
======================================================= */
router.get("/health", (req, res) =>
  res.status(200).json({
    estado: "ok",
    mensaje: "Ruta /api/productos operativa ✅",
    metodo: req.method,
    timestamp: new Date().toISOString(),
  })
);

/* =======================================================
   🔹 Productos públicos (sin auth)
======================================================= */
router.get("/", asyncHandler(getProductos));
router.get("/:id", asyncHandler(getProducto));

/* =======================================================
   🔹 Middleware para rol admin
======================================================= */
const requireAdmin = (req, res, next) => {
  if (req.user?.rol !== "admin") {
    return res.status(403).json({
      estado: "error",
      mensaje: "Solo los administradores pueden realizar esta acción",
    });
  }
  next();
};

/* =======================================================
   🔹 Crear producto (solo admin)
   🔹 NOTA: multer maneja FormData y `req.body` correctamente
======================================================= */
router.post(
  "/",
  authGuard,
  requireAdmin,
  upload.single("imagen"),   // 📸 multer captura la imagen en memoria
  handleUploadErrors,        // ⚠️ manejo seguro de errores Multer
  asyncHandler(createProducto)
);

/* =======================================================
   🔹 Actualizar producto (solo admin)
======================================================= */
router.put(
  "/:id",
  authGuard,
  requireAdmin,
  upload.single("imagen"),
  handleUploadErrors,
  asyncHandler(updateProducto)
);

/* =======================================================
   🔹 Eliminar producto (solo admin)
======================================================= */
router.delete(
  "/:id",
  authGuard,
  requireAdmin,
  asyncHandler(deleteProducto)
);

export default router;
