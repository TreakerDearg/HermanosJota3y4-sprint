// Middleware global de errores
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.customMessage || err.message || "Error interno del servidor";

  // Logging detallado en consola
  console.error(`[${new Date().toISOString()}] [ERROR] ${req.method} ${req.originalUrl}`);
  console.error(`Status: ${statusCode}`);
  console.error(`Body: ${JSON.stringify(req.body)}`);
  console.error(`Params: ${JSON.stringify(req.params)}`);
  console.error(`Query: ${JSON.stringify(req.query)}`);
  console.error(`Stack: ${err.stack}`);

  // Respuesta al cliente
  res.status(statusCode).json({
    status: "error",
    message,
    details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method
  });
};

// Middleware para rutas no encontradas (404)
export const notFoundHandler = (req, res) => {
  console.warn(`[${new Date().toISOString()}] [404] ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
    path: req.originalUrl,
    method: req.method
  });
};
