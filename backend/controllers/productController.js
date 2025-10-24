// controllers/productController.js
import mongoose from "mongoose";
import Product from "../models/Producto.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

// ===== Helpers =====
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// ===== GET /api/productos =====
export const getProductos = asyncHandler(async (req, res) => {
  const productos = await Product.find();
  res.status(200).json({
    estado: "success",
    cantidad: productos.length,
    data: productos,
  });
});

// ===== GET /api/productos/:id =====
export const getProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ estado: "error", mensaje: "ID de producto inválido" });
  }

  const producto = await Product.findById(id);
  if (!producto) {
    return res.status(404).json({ estado: "error", mensaje: "Producto no encontrado" });
  }

  res.status(200).json({ estado: "success", data: producto });
});

// ===== POST /api/productos =====
export const createProducto = asyncHandler(async (req, res) => {
  const { nombre = "", precio, categoria = "", stock, descripcion = "", destacado = false } = req.body;

  // Validación estricta y conversión de tipos
  const precioNum = Number(precio);
  const stockNum = Number(stock);

  if (!nombre.trim() || !categoria.trim() || isNaN(precioNum) || isNaN(stockNum)) {
    return res.status(400).json({
      estado: "error",
      mensaje: "Faltan campos requeridos o precio/stock inválidos",
    });
  }

  if (precioNum < 0 || stockNum < 0) {
    return res.status(400).json({
      estado: "error",
      mensaje: "Precio y stock deben ser números positivos",
    });
  }

  const nuevoProducto = new Product({
    nombre: nombre.trim(),
    precio: precioNum,
    categoria: categoria.trim(),
    stock: stockNum,
    descripcion: descripcion.trim(),
    destacado: destacado === "true" || destacado === true,
    imagenUrl: req.file ? `/uploads/${req.file.filename}` : null,
  });

  const productoGuardado = await nuevoProducto.save();

  res.status(201).json({
    estado: "success",
    mensaje: "Producto creado correctamente",
    data: productoGuardado,
  });
});

// ===== PUT /api/productos/:id =====
export const updateProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ estado: "error", mensaje: "ID de producto inválido" });
  }

  const updates = {};

  if (req.body.nombre) updates.nombre = req.body.nombre.trim();
  if (req.body.descripcion) updates.descripcion = req.body.descripcion.trim();
  if (req.body.categoria) updates.categoria = req.body.categoria.trim();
  if (req.body.precio !== undefined) {
    const precioNum = Number(req.body.precio);
    if (isNaN(precioNum) || precioNum < 0) {
      return res.status(400).json({
        estado: "error",
        mensaje: "Precio inválido",
      });
    }
    updates.precio = precioNum;
  }
  if (req.body.stock !== undefined) {
    const stockNum = Number(req.body.stock);
    if (isNaN(stockNum) || stockNum < 0) {
      return res.status(400).json({
        estado: "error",
        mensaje: "Stock inválido",
      });
    }
    updates.stock = stockNum;
  }
  if (req.body.destacado !== undefined) {
    updates.destacado = req.body.destacado === "true" || req.body.destacado === true;
  }

  if (req.file) updates.imagenUrl = `/uploads/${req.file.filename}`;

  // Actualizar producto
  const actualizado = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!actualizado) {
    return res.status(404).json({ estado: "error", mensaje: "Producto no encontrado" });
  }

  res.status(200).json({
    estado: "success",
    mensaje: "Producto actualizado correctamente",
    data: actualizado,
  });
});

// ===== DELETE /api/productos/:id =====
export const deleteProducto = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ estado: "error", mensaje: "ID de producto inválido" });
  }

  const eliminado = await Product.findByIdAndDelete(id);
  if (!eliminado) {
    return res.status(404).json({ estado: "error", mensaje: "Producto no encontrado" });
  }

  res.status(200).json({
    estado: "success",
    mensaje: "Producto eliminado correctamente",
  });
});
