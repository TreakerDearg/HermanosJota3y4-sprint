import mongoose from "mongoose";
import Producto from "../models/Producto.js";
import fs from "fs";
import path from "path";
import { asyncHandler } from "../middlewares/asyncHandler.js";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

// --------------------
// 🔹 Utilidades internas
// --------------------
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const deleteImageIfExists = (filePath) => {
  try {
    if (filePath && fs.existsSync(path.join(process.cwd(), filePath))) {
      fs.unlinkSync(path.join(process.cwd(), filePath));
      console.log(`[Storage] 🗑 Imagen eliminada: ${filePath}`);
    }
  } catch (error) {
    console.warn(`[Storage] ⚠ No se pudo eliminar imagen: ${error.message}`);
  }
};

// =============================================================
// 🔸 GET /api/productos → Obtener todos los productos
// =============================================================
export const getProductos = asyncHandler(async (req, res) => {
  const productos = await Producto.find().sort({ createdAt: -1 });
  res.status(200).json({
    estado: "success",
    total: productos.length,
    data: productos,
  });
});

// =============================================================
// 🔸 GET /api/productos/:id → Obtener producto por ID
// =============================================================
export const getProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({
      estado: "error",
      mensaje: "ID de producto inválido.",
    });
  }

  const producto = await Producto.findById(id);

  if (!producto) {
    return res.status(404).json({
      estado: "error",
      mensaje: "Producto no encontrado.",
    });
  }

  res.status(200).json({
    estado: "success",
    data: producto,
  });
});

// =============================================================
// 🔸 POST /api/productos → Crear nuevo producto
// =============================================================
export const createProducto = asyncHandler(async (req, res) => {
  console.log("[CreateProducto] req.body:", req.body);
  console.log("[CreateProducto] req.file:", req.file);

  try {
    const nombre = req.body.nombre?.trim();
    const descripcion = req.body.descripcion?.trim() || "";
    const categoria = req.body.categoria?.trim();
    const precioNum = parseFloat(req.body.precio);
    const stockNum = parseInt(req.body.stock, 10);
    const destacado = req.body.destacado === "true" || req.body.destacado === true;

    if (!nombre || !categoria || isNaN(precioNum) || isNaN(stockNum)) {
      return res.status(400).json({
        estado: "error",
        mensaje: "Campos requeridos faltantes o inválidos: nombre, precio, categoría o stock.",
      });
    }

    if (precioNum < 0 || stockNum < 0) {
      return res.status(400).json({
        estado: "error",
        mensaje: "Precio y stock deben ser números positivos.",
      });
    }

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio: precioNum,
      categoria,
      stock: stockNum,
      destacado,
      imagenUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const productoGuardado = await nuevoProducto.save();

    console.log(`[CreateProducto] ✅ Producto creado con ID: ${productoGuardado._id}`);

    res.status(201).json({
      estado: "success",
      mensaje: "Producto creado correctamente",
      data: productoGuardado,
    });

  } catch (err) {
    console.error("[CreateProducto] ❌ Error:", err.message);

    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.warn("[CreateProducto] No se pudo eliminar imagen:", unlinkErr.message);
      });
    }

    res.status(500).json({
      estado: "error",
      mensaje: "Error interno al crear el producto",
    });
  }
});

// =============================================================
// 🔸 PUT /api/productos/:id → Actualizar producto existente
// =============================================================
export const updateProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ estado: "error", mensaje: "ID inválido" });
  }

  const producto = await Producto.findById(id);
  if (!producto) {
    return res.status(404).json({ estado: "error", mensaje: "Producto no encontrado" });
  }

  const { nombre, descripcion, precio, categoria, stock, destacado } = req.body;
  const precioNum = precio !== undefined ? parseFloat(precio) : producto.precio;
  const stockNum = stock !== undefined ? parseInt(stock, 10) : producto.stock;

  if (isNaN(precioNum) || precioNum < 0) {
    return res.status(400).json({ estado: "error", mensaje: "Precio inválido" });
  }

  if (isNaN(stockNum) || stockNum < 0) {
    return res.status(400).json({ estado: "error", mensaje: "Stock inválido" });
  }

  if (req.file && producto.imagenUrl) {
    deleteImageIfExists(producto.imagenUrl);
  }

  producto.nombre = nombre?.trim() || producto.nombre;
  producto.descripcion = descripcion?.trim() || producto.descripcion;
  producto.precio = precioNum;
  producto.categoria = categoria?.trim() || producto.categoria;
  producto.stock = stockNum;
  producto.destacado = destacado === "true" || destacado === true;
  if (req.file) producto.imagenUrl = `/uploads/${req.file.filename}`;

  const actualizado = await producto.save();

  res.status(200).json({
    estado: "success",
    mensaje: "Producto actualizado correctamente",
    data: actualizado,
  });
});

// =============================================================
// 🔸 DELETE /api/productos/:id → Eliminar producto
// =============================================================
export const deleteProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    return res.status(400).json({ estado: "error", mensaje: "ID inválido" });
  }

  const producto = await Producto.findByIdAndDelete(id);
  if (!producto) {
    return res.status(404).json({ estado: "error", mensaje: "Producto no encontrado" });
  }

  if (producto.imagenUrl) {
    deleteImageIfExists(producto.imagenUrl);
  }

  res.status(200).json({
    estado: "success",
    mensaje: "Producto eliminado correctamente",
  });
});
