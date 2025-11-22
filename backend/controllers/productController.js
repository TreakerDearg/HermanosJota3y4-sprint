import Product from "../models/Product.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  successResponse,
  createdResponse,
  deletedResponse,
} from "../middlewares/responseHandler.js";
import { uploadFromBuffer, deleteImage } from "../utils/cloudinary.js";

/**
 * ==========================================
 * GET /productos — Obtener todos
 * ==========================================
 */
export const getProductos = asyncHandler(async (req, res) => {
  const productos = await Product.find().lean();
  successResponse(res, productos, "Productos cargados correctamente", req);
});

/**
 * ==========================================
 * GET /productos/:id — Obtener uno
 * ==========================================
 */
export const getProducto = asyncHandler(async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) throw new Error("ID inválido");

  const producto = await Product.findById(id).lean();
  if (!producto) throw new Error("Producto no encontrado");

  successResponse(res, producto, "Producto cargado correctamente", req);
});

/**
 * ==========================================
 * POST /productos — Crear
 * ==========================================
 */
export const createProducto = asyncHandler(async (req, res) => {
  const { nombre, descripcion, precio, categoria, stock, destacado } = req.body;

  if (!nombre || !precio || !categoria || stock === undefined) {
    throw new Error("Faltan campos obligatorios");
  }

  let imagenUrl = "";

  if (req.file?.buffer) {
    try {
      const result = await uploadFromBuffer(req.file.buffer);
      imagenUrl = result.secure_url;
    } catch (err) {
      console.error("❌ Error al subir imagen a Cloudinary:", err.message);
      // ⚠️ Se crea el producto aunque falle la subida
    }
  }

  const nuevo = await Product.create({
    nombre,
    descripcion,
    precio: Number(precio),
    categoria,
    stock: Number(stock),
    destacado: ["true", true, "on", "1", 1].includes(destacado),
    imagenUrl,
  });

  createdResponse(res, nuevo, "Producto creado correctamente", req);
});

/**
 * ==========================================
 * PUT /productos/:id — Actualizar
 * ==========================================
 */
export const updateProducto = asyncHandler(async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) throw new Error("ID inválido");

  const producto = await Product.findById(id);
  if (!producto) throw new Error("Producto no encontrado");

  const { nombre, descripcion, precio, categoria, stock, destacado } = req.body;

  const updateData = {
    nombre: nombre ?? producto.nombre,
    descripcion: descripcion ?? producto.descripcion,
    precio: precio !== undefined ? Number(precio) : producto.precio,
    categoria: categoria ?? producto.categoria,
    stock: stock !== undefined ? Number(stock) : producto.stock,
    destacado:
      destacado !== undefined
        ? ["true", true, "on", "1", 1].includes(destacado)
        : producto.destacado,
  };

  if (req.file?.buffer) {
    // Borrar imagen antigua
    if (producto.imagenUrl) {
      try {
        const segments = producto.imagenUrl.split("/");
        const public_id = `hermanos-jota/${segments.slice(-1)[0].split(".")[0]}`;
        await deleteImage(public_id);
      } catch (err) {
        console.warn("⚠️ No se pudo eliminar imagen antigua:", err.message);
      }
    }

    // Subir nueva imagen
    try {
      const result = await uploadFromBuffer(req.file.buffer);
      updateData.imagenUrl = result.secure_url;
    } catch (err) {
      console.error("❌ Error al subir nueva imagen a Cloudinary:", err.message);
    }
  }

  const actualizado = await Product.findByIdAndUpdate(id, updateData, { new: true }).lean();

  successResponse(res, actualizado, "Producto actualizado correctamente", req);
});

/**
 * ==========================================
 * DELETE /productos/:id — Eliminar
 * ==========================================
 */
export const deleteProducto = asyncHandler(async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) throw new Error("ID inválido");

  const producto = await Product.findById(id);
  if (!producto) throw new Error("Producto no encontrado");

  // Borrar imagen en Cloudinary
  if (producto.imagenUrl) {
    try {
      const segments = producto.imagenUrl.split("/");
      const public_id = `hermanos-jota/${segments.slice(-1)[0].split(".")[0]}`;
      await deleteImage(public_id);
    } catch (err) {
      console.warn("⚠️ No se pudo eliminar imagen de Cloudinary:", err.message);
    }
  }

  await Product.findByIdAndDelete(id);

  deletedResponse(res, "Producto eliminado correctamente", req);
});
