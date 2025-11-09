// routes/productos.js
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

// ==============================
// LOGGING DE REQUESTS
// ==============================
router.use((req, res, next) => {
  console.log(`[API Productos] ${req.method} ${req.originalUrl}`);
  next();
});

// ==============================
// RUTAS CRUD PRODUCTOS
// ==============================

// GET: Todos los productos
router.get("/", getProductos);

// GET: Producto por ID
router.get("/:id", getProducto);

// POST: Crear producto (imagen opcional)
router.post("/", upload.single("imagen"), handleUploadErrors, createProducto);

// PUT: Actualizar producto (imagen opcional)
router.put("/:id", upload.single("imagen"), handleUploadErrors, updateProducto);

// DELETE: Eliminar producto
router.delete("/:id", deleteProducto);

export default router;
