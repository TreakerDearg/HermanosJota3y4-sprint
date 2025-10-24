// middlewares/responseHandler.js
/**
 * Middleware para enviar respuestas uniformes de éxito
 */

const buildResponse = (res, statusCode, data = null, mensaje = "Operación exitosa", req = null) => {
  const payload = {
    estado: "success",
    mensaje,
    data,
    timestamp: new Date().toISOString(),
  };
  if (req) payload.path = req.originalUrl;

  res.status(statusCode).json(payload);
};

export const successResponse = (res, data, mensaje = "Operación exitosa", req = null) => {
  return buildResponse(res, 200, data, mensaje, req);
};

export const createdResponse = (res, data, mensaje = "Recurso creado", req = null) => {
  return buildResponse(res, 201, data, mensaje, req);
};

// Uso opcional en controladores:
// successResponse(res, producto, "Producto obtenido", req);
