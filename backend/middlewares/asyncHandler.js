// middlewares/asyncHandler.js

/**
 * Middleware universal para manejar funciones async sin try/catch repetidos.
 * Captura errores, asigna códigos correctos, registra logs avanzados
 * y centraliza el comportamiento según entorno.
 */

export const asyncHandler = (fn) => {
  return async (req, res, next) => {
    const timestamp = new Date().toISOString();
    const env = process.env.NODE_ENV || "development";

    try {
      await fn(req, res, next);
    } catch (err) {
      // Determinar status code según tipo de error
      let statusCode = 500;

      if (err.statusCode) statusCode = err.statusCode;
      else if (err.name === "ValidationError") statusCode = 400;
      else if (err.name === "CastError") statusCode = 400;
      else if (err.name === "MongoServerError" && err.code === 11000)
        statusCode = 409; // duplicado

      // Log estructurado
      const log = {
        timestamp,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        statusCode,
        error: {
          name: err.name,
          message: err.message,
          stack: env !== "production" ? err.stack : undefined,
          code: err.code || null,
        },
        body: req.body,
        params: req.params,
        query: req.query,
      };

      if (env !== "production") {
        console.error("❌ ERROR CAPTURADO (DEV):");
        console.error(JSON.stringify(log, null, 2));
      } else {
        console.error(
          `[${timestamp}] [${req.method}] ${req.originalUrl} - ❌ ${err.message}`
        );
      }

      // Evitar doble envío de headers
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

      return next(err);
    }
  };
};
