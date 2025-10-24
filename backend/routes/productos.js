// routes/productRoutes.js
import express from "express";
import {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../controllers/productController.js";
import { upload, handleUploadErrors } from "../middlewares/upload.js";

const router = express.Router();

// ===== Rutas =====

// GET /api/productos -> Obtener todos los productos
router.get("/", getProductos);

// GET /api/productos/:id -> Obtener un producto por ID
router.get("/:id", getProducto);

// POST /api/productos -> Crear producto con imagen opcional
router.post(
  "/",
  upload.single("imagen"),   // middleware multer
  handleUploadErrors,        // captura errores de multer
  createProducto
);

// PUT /api/productos/:id -> Actualizar producto con imagen opcional
router.put(
  "/:id",
  upload.single("imagen"),
  handleUploadErrors,
  updateProducto
);

// DELETE /api/productos/:id -> Eliminar producto
router.delete("/:id", deleteProducto);

export default router;
