// middlewares/authGuard.js
import jwt from "jsonwebtoken";

export const authGuard = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      estado: "error",
      mensaje: "No autorizado. Token faltante.",
    });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Aquí usamos 'rol' que viene del usuario
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({
      estado: "error",
      mensaje: "Token inválido o expirado.",
    });
  }
};
