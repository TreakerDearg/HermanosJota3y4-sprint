export const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const env = process.env.NODE_ENV || "development";

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

  const mensaje =
    err.customMessage || err.message || "Error interno del servidor.";

  if (env !== "production") {
    console.error("=".repeat(80));
    console.error(`[${timestamp}] ❌ ${tipo}`);
    console.error(`📍 Ruta: ${req.method} ${req.originalUrl}`);
    console.error(`📡 Estado: ${statusCode}`);
    console.error(`🧠 Mensaje: ${mensaje}`);
    console.error(`📦 Body: ${JSON.stringify(req.body || {}, null, 2)}`);
    console.error(`🔗 Params: ${JSON.stringify(req.params || {}, null, 2)}`);
    console.error(`💡 Query: ${JSON.stringify(req.query || {}, null, 2)}`);
    console.error(`🧩 Stack:\n${err.stack}`);
    console.error("=".repeat(80));
  } else {
    console.error(`[${timestamp}] [${tipo}] ${req.method} ${req.originalUrl} - ${mensaje}`);
  }

  res.status(statusCode).json({
    estado: "error",
    mensaje,
    data: {},                 // uniforme con successResponse
    path: req.originalUrl,
    metodo: req.method,
    timestamp,
    statusCode,
    ...(env !== "production" && { stack: err.stack }),
  });
};

export const notFoundHandler = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.warn(`[${timestamp}] ⚠️ [404] ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    estado: "error",
    mensaje: "La ruta solicitada no existe o fue movida.",
    data: {},
    path: req.originalUrl,
    metodo: req.method,
    timestamp,
    statusCode: 404,
    tipo: "RutaNoEncontrada",
  });
};
