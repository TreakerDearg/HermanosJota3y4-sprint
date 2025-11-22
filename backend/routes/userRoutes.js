import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addFavorito,
  removeFavorito,
  addToCart,
  removeFromCart,
  updateCartItem,
  getUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

// 🔹 Perfil
router.get("/profile", protect, getUserProfile);

// 🔹 Favoritos
router.post("/favoritos/:productoId", protect, addFavorito);
router.delete("/favoritos/:productoId", protect, removeFavorito);

// 🔹 Carrito
router.post("/carrito/:productoId", protect, addToCart);
router.put("/carrito/:productoId", protect, updateCartItem);
router.delete("/carrito/:productoId", protect, removeFromCart);

export default router;
