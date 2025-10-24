import mongoose from "mongoose";
import Product from "../models/Producto.js";

// Función auxiliar para validar IDs de MongoDB
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/productos - Todos los productos
export const getProductos = async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener productos", error: err.message });
  }
};

// GET /api/productos/:id - Producto por ID
export const getProducto = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ message: "ID inválido" });

  try {
    const producto = await Product.findById(id);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener producto", error: err.message });
  }
};

// POST /api/productos - Crear producto
export const createProducto = async (req, res) => {
  try {
    const nuevo = new Product(req.body);
    const guardado = await nuevo.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(400).json({ message: "Error al crear producto", error: err.message });
  }
};

// PUT /api/productos/:id - Actualizar producto
export const updateProducto = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ message: "ID inválido" });

  try {
    const actualizado = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!actualizado) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar producto", error: err.message });
  }
};

// DELETE /api/productos/:id - Eliminar producto
export const deleteProducto = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ message: "ID inválido" });

  try {
    const eliminado = await Product.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar producto", error: err.message });
  }
};
