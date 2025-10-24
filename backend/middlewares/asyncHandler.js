// middlewares/asyncHandler.js
/**
 * Middleware de manejo asíncrono de controladores.
 * Envuelve funciones async para capturar errores automáticamente
 * y pasarlos al middleware global de errores.
 *
 * Añade trazabilidad con logs contextuales.
 */
export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    const timestamp = new Date().toISOString();
    const context = `[${timestamp}] [${req.method}] ${req.originalUrl}`;

    try {
      await fn(req, res, next);
    } catch (err) {
      // Log técnico para diagnóstico
      if (process.env.NODE_ENV !== "production") {
        console.error("=".repeat(60));
        console.error(`${context} - ❌ Error capturado en asyncHandler`);
        console.error(`Mensaje: ${err.message}`);
        console.error(`Stack: ${err.stack}`);
        console.error("Request body:", req.body);
        console.error("=".repeat(60));
      } else {
        console.error(`${context} - ❌ ${err.message}`);
      }

      // Añadir statusCode si no existe
      if (!err.statusCode) err.statusCode = 500;

      // Pasa el error al middleware global
      next(err);
    }
  };
};
