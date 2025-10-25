/**
 * Middleware de logging avanzado.
 * - Registra método, URL, status, duración, IP, User-Agent.
 * - Trunca body largo para evitar logs masivos.
 * - Diferencia entorno: dev vs prod.
 */

const logger = (req, res, next) => {
  const start = Date.now();
  const ip = req.ip || req.headers["x-forwarded-for"] || "desconocida";
  const ua = req.headers["user-agent"] || "desconocido";
  const method = req.method;
  const url = req.originalUrl;

  // Hook cuando la respuesta termina
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

    // Log principal
    console.log(
      `[${new Date().toISOString()}] ${method} ${url} ${statusColor}${res.statusCode}${resetColor} - ${duration}ms - IP: ${ip} - UA: ${ua}`
    );

    // Solo desarrollo: detalle de body, query y params
    if (process.env.NODE_ENV !== "production") {
      const safeStringify = (obj) =>
        JSON.stringify(obj, (key, value) =>
          typeof value === "string" && value.length > 100 ? `${value.slice(0, 100)}...` : value
        );

      console.log(`Body: ${safeStringify(req.body)}`);
      console.log(`Query: ${safeStringify(req.query)}`);
      console.log(`Params: ${safeStringify(req.params)}`);
    }
  });

  next();
};

export default logger;
