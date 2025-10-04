const logger = (req, res, next) => {
  const start = Date.now();

  // Cuando la respuesta termine, loguea información completa
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 500
      ? "\x1b[31m" // rojo
      : res.statusCode >= 400
      ? "\x1b[33m" // amarillo
      : "\x1b[32m"; // verde

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} ${statusColor}${res.statusCode}\x1b[0m - ${duration}ms`
    );
  });

  next();
};

export default logger;
