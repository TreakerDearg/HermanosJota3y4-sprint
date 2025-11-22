// controllers/userController.js
import User from "../models/User.js";
import Producto from "../models/Producto.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  successResponse,
  createdResponse,
} from "../middlewares/responseHandler.js";

// Sanitizar usuario (eliminar password)
const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
};

// ======================================================
// 👤 Obtener perfil del usuario con favoritos y carrito
// ======================================================
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("favoritos", "nombre precio imagenUrl categoria")
    .populate("carrito.producto", "nombre precio imagenUrl stock");

  if (!user) {
    res.status(404);
    throw new Error("Perfil no encontrado");
  }

  successResponse(res, sanitizeUser(user), "Perfil cargado correctamente", req);
});

// ======================================================
// ⭐ Añadir a favoritos
// ======================================================
export const addFavorito = asyncHandler(async (req, res) => {
  const { productoId } = req.params;

  const producto = await Producto.findById(productoId).lean();
  if (!producto) {
    res.status(404);
    throw new Error("Producto no encontrado");
  }

  const user = await User.findById(req.user._id);

  if (!user.favoritos.includes(productoId)) {
    user.favoritos.push(productoId);
    await user.save();
  }

  const populated = await user.populate("favoritos", "nombre precio imagenUrl categoria");

  successResponse(
    res,
    sanitizeUser(populated),
    "Producto agregado a favoritos",
    req
  );
});

// ======================================================
// ❌ Remover favorito
// ======================================================
export const removeFavorito = asyncHandler(async (req, res) => {
  const { productoId } = req.params;

  const user = await User.findById(req.user._id);

  user.favoritos = user.favoritos.filter(
    (fav) => fav.toString() !== productoId
  );

  await user.save();

  const populated = await user.populate("favoritos", "nombre precio imagenUrl categoria");

  successResponse(
    res,
    sanitizeUser(populated),
    "Producto eliminado de favoritos",
    req
  );
});

// ======================================================
// 🛒 Añadir producto al carrito
// ======================================================
export const addToCart = asyncHandler(async (req, res) => {
  const { productoId } = req.params;
  const { cantidad = 1 } = req.body;

  const producto = await Producto.findById(productoId).lean();
  if (!producto) {
    res.status(404);
    throw new Error("Producto no encontrado");
  }

  if (producto.stock <= 0) {
    res.status(400);
    throw new Error("Producto sin stock");
  }

  const user = await User.findById(req.user._id);

  const item = user.carrito.find(
    (entry) => entry.producto.toString() === productoId
  );

  if (item) {
    const nuevaCantidad = item.cantidad + cantidad;
    item.cantidad = Math.min(nuevaCantidad, producto.stock);
  } else {
    user.carrito.push({
      producto: productoId,
      cantidad: Math.min(cantidad, producto.stock),
    });
  }

  await user.save();

  const populated = await user.populate("carrito.producto", "nombre precio imagenUrl stock");

  successResponse(res, sanitizeUser(populated), "Producto agregado al carrito", req);
});

// ======================================================
// 🔄 Actualizar cantidad en el carrito
// ======================================================
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productoId } = req.params;
  const { cantidad } = req.body;

  if (!cantidad || cantidad < 1) {
    res.status(400);
    throw new Error("Cantidad inválida");
  }

  const producto = await Producto.findById(productoId).lean();
  if (!producto) {
    res.status(404);
    throw new Error("Producto no encontrado");
  }

  const user = await User.findById(req.user._id);

  const item = user.carrito.find(
    (entry) => entry.producto.toString() === productoId
  );

  if (!item) {
    res.status(404);
    throw new Error("El producto no está en tu carrito");
  }

  item.cantidad = Math.min(cantidad, producto.stock);

  await user.save();

  const populated = await user.populate("carrito.producto", "nombre precio imagenUrl stock");

  successResponse(
    res,
    sanitizeUser(populated),
    "Carrito actualizado correctamente",
    req
  );
});

// ======================================================
// 🗑 Eliminar producto del carrito
// ======================================================
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productoId } = req.params;

  const user = await User.findById(req.user._id);

  user.carrito = user.carrito.filter(
    (entry) => entry.producto.toString() !== productoId
  );

  await user.save();

  const populated = await user.populate("carrito.producto", "nombre precio imagenUrl stock");

  successResponse(
    res,
    sanitizeUser(populated),
    "Producto eliminado del carrito",
    req
  );
});
