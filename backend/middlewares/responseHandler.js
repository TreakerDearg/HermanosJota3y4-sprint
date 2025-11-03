// middlewares/responseHandler.js
const buildResponse = (res, statusCode, data = {}, mensaje = "Operación exitosa", req = null) => {
  const payload = {
    estado: "success",
    mensaje,
    data,
    timestamp: new Date().toISOString(),
  };
  if (req) payload.path = req.originalUrl;

  res.status(statusCode).json(payload);
};

export const successResponse = (res, data = {}, mensaje = "Operación exitosa", req = null) =>
  buildResponse(res, 200, data, mensaje, req);

export const createdResponse = (res, data = {}, mensaje = "Recurso creado", req = null) =>
  buildResponse(res, 201, data, mensaje, req);

export const deletedResponse = (res, mensaje = "Recurso eliminado", req = null) =>
  buildResponse(res, 200, {}, mensaje, req);
