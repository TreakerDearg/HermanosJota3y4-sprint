import productos from "../data/products.js";
import { successResponse } from "../middlewares/responseHandler.js";

// Obtener todos los productos
export const obtenerProductos = (req, res, next) => {
  try {
    console.log(`[INFO] ${req.method} ${req.originalUrl} - obteniendo todos los productos`);
    console.log(`Query params: ${JSON.stringify(req.query)}`);

    if (!productos || productos.length === 0) {
      const error = new Error("No hay productos disponibles");
      error.statusCode = 404;
      throw error;
    }

    successResponse(res, productos, "Productos obtenidos correctamente");
  } catch (err) {
    next(err);
  }
};

// Obtener producto por ID con validación
export const obtenerProductoPorId = (req, res, next) => {
  try {
    console.log(`[INFO] ${req.method} ${req.originalUrl} - obteniendo producto por ID`);
    console.log(`Params: ${JSON.stringify(req.params)}`);
    console.log(`Query params: ${JSON.stringify(req.query)}`);

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const error = new Error("ID inválido");
      error.statusCode = 400;
      throw error;
    }

    const producto = productos.find(p => p.id === id);
    if (!producto) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    successResponse(res, producto, "Producto obtenido correctamente");
  } catch (err) {
    next(err);
  }
};
