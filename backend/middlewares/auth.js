import jwt from "jsonwebtoken";

/**
 * Formato uniforme para enviar errores de autenticación
 */
const sendAuthError = (res, req, message, status = 401) => {
  return res.status(status).json({
    estado: "error",
    mensaje: message,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
};

/**
 * authGuard simplificado para rutas internas o públicas con JWT opcional.
 * Este no consulta DB — solo valida firma y payload.
 */
export const authGuard = (req, res, next) => {
  const header = req.headers.authorization ?? "";

  // Validar formato
  if (!header.startsWith("Bearer ")) {
    return sendAuthError(res, req, "Acceso no autorizado");
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validación extra por seguridad
    if (!decoded?.id || !decoded?.email || !decoded?.role) {
      return sendAuthError(res, req, "Token corrupto");
    }

    // No expose password ni fields innecesarios
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return sendAuthError(res, req, "Token inválido o expirado");
  }
};
