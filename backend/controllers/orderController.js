// controllers/orderController.js
import Order from "../models/Order.js";
import Producto from "../models/Producto.js";
import User from "../models/User.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import {
  successResponse,
  createdResponse,
} from "../middlewares/responseHandler.js";

// ======================================================
// 📦 Crear una orden a partir del carrito del usuario
// ======================================================
export const createOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "carrito.producto",
    "nombre precio stock imagenUrl"
  );

  if (!user) {
    res.status(404);
    throw new Error("Usuario no encontrado");
  }

  if (user.carrito.length === 0) {
    res.status(400);
    throw new Error("El carrito está vacío");
  }

  // Validar stock antes de procesar
  for (const item of user.carrito) {
    if (item.cantidad > item.producto.stock) {
      res.status(400);
      throw new Error(`Stock insuficiente para ${item.producto.nombre}`);
    }
  }

  // Calcular total
  const total = user.carrito.reduce((acc, item) => {
    return acc + item.producto.precio * item.cantidad;
  }, 0);

  // Crear orden
  const nuevaOrden = await Order.create({
    usuario: user._id,
    items: user.carrito.map((item) => ({
      producto: item.producto._id,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio,
    })),
    total,
    estado: "PENDING",
  });

  // Restar stock real
  for (const item of user.carrito) {
    const producto = await Producto.findById(item.producto._id);
    producto.stock -= item.cantidad;
    await producto.save();
  }

  // Vaciar carrito
  user.carrito = [];
  await user.save();

  createdResponse(res, nuevaOrden, "Orden creada correctamente", req);
});

// ======================================================
// 📄 Obtener órdenes del usuario autenticado
// ======================================================
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ usuario: req.user._id })
    .populate("items.producto", "nombre precio imagenUrl")
    .sort({ createdAt: -1 });

  successResponse(res, orders, "Órdenes cargadas correctamente", req);
});

// ======================================================
// 📌 Obtener una sola orden
// ======================================================
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "items.producto",
    "nombre precio imagen imagenUrl"
  );

  if (!order) {
    res.status(404);
    throw new Error("Orden no encontrada");
  }

  // Seguridad: Solo dueño o admin
  if (order.usuario.toString() !== req.user._id.toString() && req.user.rol !== "admin") {
    res.status(403);
    throw new Error("No autorizado para ver esta orden");
  }

  successResponse(res, order, "Orden cargada correctamente", req);
});

// ======================================================
// 🏷️ Cambiar estado de la orden (ADMIN)
// ======================================================
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { estado } = req.body;

  const validStates = ["PENDING", "PAID", "CANCELLED", "SHIPPED", "DELIVERED"];

  if (!validStates.includes(estado)) {
    res.status(400);
    throw new Error("Estado no válido");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Orden no encontrada");
  }

  order.estado = estado;
  await order.save();

  successResponse(res, order, "Estado de la orden actualizado", req);
});
