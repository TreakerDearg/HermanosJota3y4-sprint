// controllers/productController.js
import fs from "fs";
import path from "path";
import os from "os";
import Product from "../models/Product.js";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 📂 Directorio de uploads
const UPLOAD_DIR =
  process.env.NODE_ENV === "production"
    ? path.join(os.tmpdir(), "uploads")
    : path.join(process.cwd(), "uploads");

// 🌐 Base URL dinámica según entorno
const RAW_BASE_URL =
  process.env.BASE_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  `http://localhost:${process.env.PORT || 5000}`;

// 🔹 Elimina "/api" del final si lo tiene (evita rutas inválidas tipo /api/uploads)
const BASE_URL = RAW_BASE_URL.replace(/\/api$/, "");

// Crear carpeta si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`[Storage] Carpeta de uploads creada en: ${UPLOAD_DIR}`);
}

// ======================================================
// 🔹 GET /productos - Obtener todos
// ======================================================
export const getProductos = async (req, res) => {
  try {
    const productos = await Product.find();

    const productosConImagen = productos.map((p) => ({
      ...p._doc,
      imagenUrl: p.imagen ? `${BASE_URL}${p.imagen}` : null,
    }));

    res.json({ success: true, data: productosConImagen });
  } catch (err) {
    console.error("❌ Error al obtener productos:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ======================================================
// 🔹 GET /productos/:id - Obtener uno
// ======================================================
export const getProducto = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

    const productoConImagen = {
      ...producto._doc,
      imagenUrl: producto.imagen ? `${BASE_URL}${producto.imagen}` : null,
    };

    res.json({ success: true, data: productoConImagen });
  } catch (err) {
    res.status(400).json({ message: "ID inválido" });
  }
};

// ======================================================
// 🔹 POST /productos - Crear nuevo producto
// ======================================================
export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, stock, destacado } = req.body;

    let imagenPath = null;
    if (req.file) imagenPath = `/uploads/${req.file.filename}`;

    const nuevo = new Product({
      nombre,
      descripcion,
      precio,
      categoria,
      stock,
      destacado,
      imagen: imagenPath,
    });

    const guardado = await nuevo.save();

    res.status(201).json({
      success: true,
      data: {
        ...guardado._doc,
        imagenUrl: imagenPath ? `${BASE_URL}${imagenPath}` : null,
      },
    });
  } catch (err) {
    console.error("❌ Error al crear producto:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ======================================================
// 🔹 PUT /productos/:id - Actualizar producto
// ======================================================
export const updateProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, stock, destacado } = req.body;
    const productoActual = await Product.findById(req.params.id);

    if (!productoActual) return res.status(404).json({ message: "Producto no encontrado" });

    let updateData = { nombre, descripcion, precio, categoria, stock, destacado };

    if (req.file) {
      // Eliminar imagen anterior si existía
      if (productoActual.imagen) {
        const oldPath = path.join(process.cwd(), productoActual.imagen);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.imagen = `/uploads/${req.file.filename}`;
    }

    const actualizado = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json({
      success: true,
      data: {
        ...actualizado._doc,
        imagenUrl: actualizado.imagen ? `${BASE_URL}${actualizado.imagen}` : null,
      },
    });
  } catch (err) {
    console.error("❌ Error al actualizar producto:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// ======================================================
// 🔹 DELETE /productos/:id - Eliminar producto
// ======================================================
export const deleteProducto = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

    if (producto.imagen) {
      const filePath = path.join(process.cwd(), producto.imagen);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar producto:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};
