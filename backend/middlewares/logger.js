// middlewares/logger.js
/**
 * Middleware de logging profesional.
 * Registra método, URL, status, duración, IP y User-Agent.
 * En desarrollo muestra body, query y params de manera controlada.
 */
const logger = (req, res, next) => {
  const start = Date.now();
  const ip = req.ip || req.headers["x-forwarded-for"] || "desconocida";
  const ua = req.headers["user-agent"] || "desconocido";

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Colores según status
    const getStatusColor = (status) => {
      if (status >= 500) return "\x1b[31m"; // rojo
      if (status >= 400) return "\x1b[33m"; // amarillo
      if (status >= 300) return "\x1b[34m"; // azul
      return "\x1b[32m"; // verde
    };

    const resetColor = "\x1b[0m";
    const statusColor = getStatusColor(res.statusCode);

    // Log resumido
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${statusColor}${res.statusCode}${resetColor} - ${duration}ms - IP: ${ip} - UA: ${ua}`
    );

    // Log detallado solo en desarrollo
    if (process.env.NODE_ENV === "development") {
      const safeBody = JSON.stringify(req.body, (key, value) => 
        typeof value === 'string' && value.length > 100 ? `${value.slice(0, 100)}...` : value
      );
      console.log(`Body: ${safeBody}`);
      console.log(`Query: ${JSON.stringify(req.query)}`);
      console.log(`Params: ${JSON.stringify(req.params)}`);
    }
  });

  next();
};

export default logger;
