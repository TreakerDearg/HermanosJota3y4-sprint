import express from "express";
import { obtenerProductos, obtenerProductoPorId } from "../controllers/productosController.js";

const router = express.Router();

router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);

export default router;
