// backend/controllers/productosController.js
import productos from "../data/products.js";

// Obtener todos los productos
export const obtenerProductos = (req, res) => {
  // Siempre devolvemos un array
  res.status(200).json(productos);
};

// Obtener un producto por ID
export const obtenerProductoPorId = (req, res) => {
  const id = parseInt(req.params.id);
  const producto = productos.find((p) => p.id === id);
  if (!producto) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
  }
  res.status(200).json(producto);
};
