// middlewares/errorHandler.js

/**
 * Middleware global de errores.
 * Captura cualquier error lanzado por controladores o middleware,
 * loguea contexto y responde de manera uniforme en JSON.
 */
export const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const statusCode = err.statusCode || 500;
  const message = err.customMessage || err.message || "Error interno del servidor";

  // Logging detallado en consola
  if (process.env.NODE_ENV !== "production") {
    console.error("=".repeat(60));
    console.error(`[${timestamp}] [ERROR] ${req.method} ${req.originalUrl}`);
    console.error(`Status: ${statusCode}`);
    console.error(`Message: ${message}`);
    console.error(`Body: ${JSON.stringify(req.body)}`);
    console.error(`Params: ${JSON.stringify(req.params)}`);
    console.error(`Query: ${JSON.stringify(req.query)}`);
    console.error(`Stack: ${err.stack}`);
    console.error("=".repeat(60));
  } else {
    // Producción: logs mínimos, sin exponer body
    console.error(`[${timestamp}] [ERROR] ${req.method} ${req.originalUrl} - ${message}`);
  }

  // Respuesta uniforme al cliente
  res.status(statusCode).json({
    status: "error",
    message,
    path: req.originalUrl,
    method: req.method,
    timestamp,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundHandler = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] [404] ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
    path: req.originalUrl,
    method: req.method,
    timestamp,
  });
};
