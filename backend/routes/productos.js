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

// ==============================
// LOGGING Y VALIDACIÓN BÁSICA
// ==============================
router.use((req, res, next) => {
  console.log(`[API Productos] ${req.method} ${req.originalUrl}`);
  next();
});

// ==============================
// GET: Obtener todos los productos
// ==============================
router.get("/", async (req, res, next) => {
  try {
    await getProductos(req, res);
  } catch (err) {
    console.error("[GET /productos] Error:", err.message);
    next(err);
  }
});

// ==============================
// GET: Obtener un producto por ID
// ==============================
router.get("/:id", async (req, res, next) => {
  try {
    await getProducto(req, res);
  } catch (err) {
    console.error("[GET /productos/:id] Error:", err.message);
    next(err);
  }
});

// ==============================
// POST: Crear producto (con imagen opcional)
// ==============================
router.post(
  "/",
  upload.single("imagen"),   // Multer sube archivo
  handleUploadErrors,        // Si falla Multer
  async (req, res, next) => {
    try {
      await createProducto(req, res);
    } catch (err) {
      console.error("[POST /productos] Error:", err.message);
      next(err);
    }
  }
);

// ==============================
// PUT: Actualizar producto (con imagen opcional)
// ==============================
router.put(
  "/:id",
  upload.single("imagen"),
  handleUploadErrors,
  async (req, res, next) => {
    try {
      await updateProducto(req, res);
    } catch (err) {
      console.error("[PUT /productos/:id] Error:", err.message);
      next(err);
    }
  }
);

// ==============================
// DELETE: Eliminar producto
// ==============================
router.delete("/:id", async (req, res, next) => {
  try {
    await deleteProducto(req, res);
  } catch (err) {
    console.error("[DELETE /productos/:id] Error:", err.message);
    next(err);
  }
});

export default router;
