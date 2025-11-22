import { randomUUID } from "crypto";

const logger = (req, res, next) => {
  const start = Date.now();
  const ip = req.ip || req.headers["x-forwarded-for"] || "desconocida";
  const ua = req.headers["user-agent"] || "desconocido";
  const method = req.method;
  const url = req.originalUrl;
  const requestId = randomUUID();
  const env = process.env.NODE_ENV || "development";

  // Hook cuando la respuesta termina
  res.on("finish", () => {
    const duration = Date.now() - start;

    const getStatusColor = (status) => {
      if (status >= 500) return "\x1b[31m"; // rojo
      if (status >= 400) return "\x1b[33m"; // amarillo
      if (status >= 300) return "\x1b[34m"; // azul
      return "\x1b[32m"; // verde
    };

    const getLogLevel = (status) => {
      if (status >= 500) return "error";
      if (status >= 400) return "warn";
      return "info";
    };

    const resetColor = "\x1b[0m";
    const statusColor = getStatusColor(res.statusCode);
    const logLevel = getLogLevel(res.statusCode);

    const safeTruncate = (obj, maxLen = 200) => {
      if (!obj || typeof obj !== "object") return obj;
      const copy = {};
      for (const key in obj) {
        if (!Object.hasOwn(obj, key)) continue;
        let value = obj[key];
        if (value === undefined) value = null;
        else if (typeof value === "string" && value.length > maxLen)
          value = `${value.slice(0, maxLen)}...`;
        else if (typeof value === "object" && value !== null)
          value = safeTruncate(value, maxLen);
        copy[key] = value;
      }
      return copy;
    };

    const baseLog = {
      timestamp: new Date().toISOString(),
      requestId,
      method,
      url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent: ua,
      level: logLevel,
    };

    if (env !== "production") {
      baseLog.body = safeTruncate(req.body);
      baseLog.query = safeTruncate(req.query);
      baseLog.params = safeTruncate(req.params);
      console.log(`${statusColor}[${logLevel.toUpperCase()}] ${JSON.stringify(baseLog, null, 2)}${resetColor}`);
    } else {
      // Producción: log resumido JSON
      console.log(JSON.stringify(baseLog));
    }
  });

  next();
};

export default logger;
