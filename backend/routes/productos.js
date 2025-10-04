// backend/routes/productos.js
import express from "express";
import { obtenerProductos, obtenerProductoPorId } from "../controllers/productosController.js";

const router = express.Router();

// Middleware wrapper para capturar errores async
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Rutas de productos
router.get("/", asyncHandler(obtenerProductos));
router.get("/:id", asyncHandler(obtenerProductoPorId));

export default router;
