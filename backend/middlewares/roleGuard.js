// middlewares/roleGuard.js

export const adminGuard = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso restringido" });
  }
  next();
};

// Versión escalable: permite uno o varios roles autorizados.
export const roleGuard = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permisos suficientes" });
    }
    next();
  };
};

// Control de dueño del recurso (ej: usuario editando su propio perfil)
export const ownerGuard = (idParam = "id") => {
  return (req, res, next) => {
    const targetId = req.params[idParam];

    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    if (req.user.role === "admin") {
      return next(); // Admin siempre puede
    }

    if (req.user.id !== targetId) {
      return res.status(403).json({ message: "No puedes modificar este recurso" });
    }

    next();
  };
};
