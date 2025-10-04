// Middleware global de errores
export const errorHandler = (err, req, res, next) => {
  // Status code por defecto
  const statusCode = err.statusCode || 500;
  const mensaje = err.customMessage || err.message || "Error interno del servidor";

  // Log completo en consola
  console.error(`[${new Date().toISOString()}] [ERROR] ${req.method} ${req.url}`);
  console.error(`Status: ${statusCode}`);
  console.error(`Body: ${JSON.stringify(req.body)}`);
  console.error(`Params: ${JSON.stringify(req.params)}`);
  console.error(`Query: ${JSON.stringify(req.query)}`);
  console.error(`Stack: ${err.stack}`);

  // Respuesta al cliente
  res.status(statusCode).json({
    estado: "error",
    mensaje,
    // Stack solo en desarrollo
    detalles: process.env.NODE_ENV === "production" ? undefined : err.stack,
    ruta: req.originalUrl,
    metodo: req.method
  });

  // Si hubiera otro middleware que quiera manejar errores (opcional)
  if (next) next();
};

// Middleware para rutas no encontradas (404)
export const notFoundHandler = (req, res, next) => {
  console.warn(`[${new Date().toISOString()}] [404] ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    estado: "error",
    mensaje: "Ruta no encontrada",
    ruta: req.originalUrl,
    metodo: req.method
  });

  if (next) next();
};
