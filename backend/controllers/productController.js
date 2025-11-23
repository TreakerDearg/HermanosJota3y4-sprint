// controllers/productController.js
import Product from "../models/Product.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { uploadFromBuffer, deleteImage } from "../middlewares/cloudinary.js";

/* =======================================================
   📌 Obtener todos los productos
======================================================= */
export const getProductos = asyncHandler(async (req, res) => {
  try {
    const productos = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ estado: "success", data: productos });
  } catch (err) {
    return res.status(500).json({ estado: "error", mensaje: "Error obteniendo productos", detalle: err.message });
  }
});

/* =======================================================
   📌 Obtener producto por ID
======================================================= */
export const getProducto = asyncHandler(async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ estado: "error", mensaje: "Producto no encontrado" });
    return res.status(200).json({ estado: "success", data: producto });
  } catch (err) {
    return res.status(500).json({ estado: "error", mensaje: "Error obteniendo producto", detalle: err.message });
  }
});

/* =======================================================
   📌 Crear producto con manejo de Cloudinary
======================================================= */
export const createProducto = asyncHandler(async (req, res) => {
  try {
    // Normalizar y parsear campos
    const nombre = req.body.nombre?.toString().trim();
    const descripcion = req.body.descripcion?.toString().trim() || "";
    const categoria = req.body.categoria?.toString().trim();
    const precio = Number(req.body.precio);
    const stock = Number(req.body.stock);
    const destacado = req.body.destacado === "true" || req.body.destacado === true;

    // Validación estricta de campos obligatorios
    if (!nombre) return res.status(400).json({ estado: "error", mensaje: "Nombre es obligatorio" });
    if (!categoria) return res.status(400).json({ estado: "error", mensaje: "Categoría es obligatoria" });
    if (isNaN(precio) || precio <= 0) return res.status(400).json({ estado: "error", mensaje: "Precio inválido" });
    if (isNaN(stock) || stock < 0) return res.status(400).json({ estado: "error", mensaje: "Stock inválido" });

    // Preparar objeto de producto
    const nuevoProductoData = { nombre, descripcion, categoria, precio, stock, destacado };

    // Manejo de imagen
    if (req.file) {
      try {
        const result = await uploadFromBuffer(req.file.buffer);
        nuevoProductoData.imagenUrl = result.secure_url;
        nuevoProductoData.imagenPublicId = result.public_id;
      } catch (err) {
        return res.status(500).json({ estado: "error", mensaje: "Error subiendo imagen", detalle: err.message });
      }
    }

    const nuevoProducto = await Product.create(nuevoProductoData);
    return res.status(201).json({ estado: "success", mensaje: "Producto creado correctamente", data: nuevoProducto });
  } catch (err) {
    return res.status(500).json({ estado: "error", mensaje: "Error creando producto", detalle: err.message });
  }
});

/* =======================================================
   📌 Actualizar producto con manejo de Cloudinary
======================================================= */
export const updateProducto = asyncHandler(async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ estado: "error", mensaje: "Producto no encontrado" });

    // Normalizar y parsear campos entrantes
    const nombre = req.body.nombre?.toString().trim() ?? producto.nombre;
    const descripcion = req.body.descripcion?.toString().trim() ?? producto.descripcion;
    const categoria = req.body.categoria?.toString().trim() ?? producto.categoria;
    const precio = req.body.precio !== undefined ? Number(req.body.precio) : producto.precio;
    const stock = req.body.stock !== undefined ? Number(req.body.stock) : producto.stock;
    const destacado = req.body.destacado !== undefined ? (req.body.destacado === "true" || req.body.destacado === true) : producto.destacado;

    if (isNaN(precio) || precio <= 0) return res.status(400).json({ estado: "error", mensaje: "Precio inválido" });
    if (isNaN(stock) || stock < 0) return res.status(400).json({ estado: "error", mensaje: "Stock inválido" });

    const actualizadoData = { nombre, descripcion, categoria, precio, stock, destacado, imagenUrl: producto.imagenUrl, imagenPublicId: producto.imagenPublicId };

    // Reemplazar imagen si viene nueva
    if (req.file) {
      if (producto.imagenPublicId) await deleteImage(producto.imagenPublicId);
      const result = await uploadFromBuffer(req.file.buffer);
      actualizadoData.imagenUrl = result.secure_url;
      actualizadoData.imagenPublicId = result.public_id;
    }

    const actualizado = await Product.findByIdAndUpdate(req.params.id, actualizadoData, { new: true, runValidators: true });
    return res.status(200).json({ estado: "success", mensaje: "Producto actualizado correctamente", data: actualizado });
  } catch (err) {
    return res.status(500).json({ estado: "error", mensaje: "Error actualizando producto", detalle: err.message });
  }
});

/* =======================================================
   📌 Eliminar producto y su imagen de Cloudinary
======================================================= */
export const deleteProducto = asyncHandler(async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto) return res.status(404).json({ estado: "error", mensaje: "Producto no encontrado" });

    if (producto.imagenPublicId) await deleteImage(producto.imagenPublicId);
    await producto.deleteOne();

    return res.status(200).json({ estado: "success", mensaje: "Producto eliminado correctamente" });
  } catch (err) {
    return res.status(500).json({ estado: "error", mensaje: "Error eliminando producto", detalle: err.message });
  }
});
