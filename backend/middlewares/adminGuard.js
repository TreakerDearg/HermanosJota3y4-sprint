// middlewares/adminGuard.js
export const adminGuard = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso denegado: se requiere rol de administrador" });
  }
  next();
};
