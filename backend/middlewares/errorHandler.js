// middlewares/errorHandler.js

/**
 * Middleware global de errores.
 * Centraliza la captura, logging y respuesta uniforme de todos los errores
 * que se produzcan en controladores o middlewares.
 *
 * Beneficios:
 *  - Mantiene consistencia en respuestas API.
 *  - Permite diagnosticar fácilmente errores críticos o lógicos.
 *  - Compatible con asyncHandler y cualquier middleware Express.
 */

export const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const env = process.env.NODE_ENV || "development";

  // Clasificación de tipo de error
  let statusCode = err.statusCode || 500;
  let tipo = "ErrorServidor";

  if (err.name === "ValidationError") {
    statusCode = 400;
    tipo = "ErrorValidacion";
  } else if (err.name === "CastError") {
    statusCode = 400;
    tipo = "ErrorFormatoID";
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    statusCode = 409;
    tipo = "ErrorDuplicado";
    err.message = `Registro duplicado: ${JSON.stringify(err.keyValue)}`;
  } else if (statusCode >= 400 && statusCode < 500) {
    tipo = "ErrorCliente";
  }

  const message =
    err.customMessage ||
    err.message ||
    "Error interno del servidor. Inténtelo nuevamente más tarde.";

  // Logging detallado en entorno desarrollo/staging
  if (env !== "production") {
    console.error("=".repeat(80));
    console.error(`[${timestamp}] ❌ ${tipo}`);
    console.error(`📍 Ruta: ${req.method} ${req.originalUrl}`);
    console.error(`📡 Estado: ${statusCode}`);
    console.error(`🧠 Mensaje: ${message}`);
    console.error(`📦 Body: ${JSON.stringify(req.body || {}, null, 2)}`);
    console.error(`🔗 Params: ${JSON.stringify(req.params || {}, null, 2)}`);
    console.error(`💡 Query: ${JSON.stringify(req.query || {}, null, 2)}`);
    console.error(`🧩 Stack:\n${err.stack}`);
    console.error("=".repeat(80));
  } else {
    // Producción: log resumido
    console.error(`[${timestamp}] [${tipo}] ${req.method} ${req.originalUrl} - ${message}`);
  }

  // Respuesta estándar
  res.status(statusCode).json({
    estado: "error",
    tipo,
    mensaje: message,
    path: req.originalUrl,
    metodo: req.method,
    timestamp,
    ...(env !== "production" && { stack: err.stack }), // Solo en entornos no productivos
  });
};

/**
 * Middleware 404 - Ruta no encontrada
 */
export const notFoundHandler = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] ⚠️ [404] ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    estado: "error",
    tipo: "RutaNoEncontrada",
    mensaje: "La ruta solicitada no existe o fue movida.",
    path: req.originalUrl,
    metodo: req.method,
    timestamp,
  });
};
