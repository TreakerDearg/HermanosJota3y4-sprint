// middlewares/asyncHandler.js

/**
 * Middleware de manejo asíncrono de controladores.
 * Captura errores en funciones async sin necesidad de try/catch repetitivos.
 * Integra trazabilidad contextual, detección de entorno y logging estructurado.
 *
 * Beneficios:
 *  - Centraliza la gestión de excepciones async.
 *  - Mejora la trazabilidad de errores sin contaminar controladores.
 *  - Aporta visibilidad detallada del contexto HTTP y payload.
 */

export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    const timestamp = new Date().toISOString();
    const context = `[${timestamp}] [${req.method}] ${req.originalUrl}`;
    const env = process.env.NODE_ENV || "development";

    try {
      await fn(req, res, next);
    } catch (err) {
      // Definir código de error por tipo (fallback 500)
      const statusCode =
        err.statusCode ||
        (err.name === "ValidationError"
          ? 400
          : err.name === "CastError"
          ? 400
          : 500);

      // Logging estructurado para entornos no productivos
      if (env !== "production") {
        console.error("=".repeat(80));
        console.error(`${context}`);
        console.error(`🔍 Contexto: ${req.ip} - ${req.headers["user-agent"]}`);
        console.error(`❌ Error: ${err.message}`);
        console.error(`📦 Tipo: ${err.name}`);
        if (err.code) console.error(`🧩 Código interno: ${err.code}`);
        if (Object.keys(req.body || {}).length > 0) {
          console.error("📨 Request Body:", JSON.stringify(req.body, null, 2));
        }
        if (Object.keys(req.params || {}).length > 0) {
          console.error("🔗 Params:", JSON.stringify(req.params, null, 2));
        }
        if (Object.keys(req.query || {}).length > 0) {
          console.error("💡 Query:", JSON.stringify(req.query, null, 2));
        }
        console.error(`🧠 Stack Trace:\n${err.stack}`);
        console.error("=".repeat(80));
      } else {
        // En producción, log limpio y resumido
        console.error(`${context} - ❌ ${err.message} (${err.name})`);
      }

      // Normalizar respuesta si aún no fue enviada
      if (!res.headersSent) {
        res.status(statusCode).json({
          estado: "error",
          mensaje:
            env === "production"
              ? "Ocurrió un error interno. Inténtalo más tarde."
              : err.message,
          detalle: env !== "production" ? err.stack : undefined,
        });
      }

      // Pasar error al middleware global (si existe)
      next(err);
    }
  };
};
