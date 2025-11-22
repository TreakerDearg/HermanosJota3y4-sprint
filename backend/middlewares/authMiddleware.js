// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Respuesta estándar de error para autenticación/autorización.
 */
const sendAuthError = (res, message, req, status = 401) => {
  return res.status(status).json({
    estado: "error",
    mensaje: message,
    path: req.originalUrl,
    metodo: req.method,
    timestamp: new Date().toISOString(),
  });
};

/**
 * PROTECT → Verifica token JWT y adjunta req.user
 */
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return sendAuthError(res, "Token faltante o mal formateado", req);
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return sendAuthError(res, "Token inválido o expirado", req);
    }

    if (!decoded?.id) {
      return sendAuthError(res, "Token corrupto", req);
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return sendAuthError(res, "Usuario no encontrado", req);
    }

    req.user = user;

    // Log solo en DEV
    if (process.env.NODE_ENV !== "production") {
      console.log(`[AUTH] ✓ Autenticado: ${user.email} (rol: ${user.rol})`);
    }

    return next();
  } catch (err) {
    console.error("[AUTH] Error inesperado:", err.message);
    return sendAuthError(res, "Error interno de autenticación", req, 500);
  }
};

/**
 * ADMIN → Solo administradores
 */
export const admin = (req, res, next) => {
  if (req.user?.rol === "admin") return next();
  return sendAuthError(res, "Acceso restringido a administradores", req, 403);
};

/**
 * authorizeRoles → Permite múltiples roles
 * Ej: authorizeRoles("admin", "editor")
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendAuthError(res, "No autorizado", req);
    }

    if (!roles.includes(req.user.rol)) {
      return sendAuthError(
        res,
        "Tu rol no tiene permisos para acceder a esta ruta",
        req,
        403
      );
    }

    return next();
  };
};
