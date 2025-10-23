const logger = (req, res, next) => {
  const start = Date.now();
  const ip = req.ip || req.headers["x-forwarded-for"] || "desconocida";
  const ua = req.headers["user-agent"] || "desconocido";

  res.on("finish", () => {
    const duration = Date.now() - start;

    // Colores según status
    const statusColor =
      res.statusCode >= 500 ? "\x1b[31m" : // rojo
      res.statusCode >= 400 ? "\x1b[33m" : // amarillo
      res.statusCode >= 300 ? "\x1b[34m" : // azul
      "\x1b[32m"; // verde

    const resetColor = "\x1b[0m";

    // Log resumido
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${statusColor}${res.statusCode}${resetColor} - ${duration}ms - IP: ${ip} - UA: ${ua}`
    );

    // Log detallado en desarrollo
    if (process.env.NODE_ENV === "development") {
      console.log(`Body: ${JSON.stringify(req.body)}`);
      console.log(`Query: ${JSON.stringify(req.query)}`);
      console.log(`Params: ${JSON.stringify(req.params)}`);
    }
  });

  next();
};

export default logger;
