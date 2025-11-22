const buildResponse = (res, statusCode, data = {}, mensaje = "Operación exitosa", req = null) => {
  const env = process.env.NODE_ENV || "development";
  const payload = {
    estado: "success",
    mensaje,
    data,
    statusCode,
    timestamp: new Date().toISOString(),
    requestId: req?.requestId || undefined,
    path: req?.originalUrl || undefined,
    metodo: req?.method || undefined,
  };

  if (env !== "production" && req) {
    payload.body = req.body || undefined;
    payload.query = req.query || undefined;
    payload.params = req.params || undefined;
  }

  res.status(statusCode).json(payload);
};

export const successResponse = (res, data = {}, mensaje = "Operación exitosa", req = null) =>
  buildResponse(res, 200, data, mensaje, req);

export const createdResponse = (res, data = {}, mensaje = "Recurso creado", req = null) =>
  buildResponse(res, 201, data, mensaje, req);

export const deletedResponse = (res, mensaje = "Recurso eliminado", req = null) =>
  buildResponse(res, 200, {}, mensaje, req);
