// routes/authRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  updateProfile,
} from "../controllers/authController.js";

const router = express.Router();

// ===============================================
// Registro
// ===============================================
router.post("/register", registerUser);

// ===============================================
// Login
// ===============================================
router.post("/login", loginUser);

// ===============================================
// Obtener datos del usuario autenticado
// ===============================================
router.get("/me", protect, getMe);

// ===============================================
// Actualizar contraseña
// ===============================================
router.put("/update-password", protect, changePassword);

// ===============================================
// Actualizar perfil (nombre, email, dirección, teléfono)
// ===============================================
router.put("/update-profile", protect, updateProfile);

export default router;
