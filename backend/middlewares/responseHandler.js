// Middleware para respuestas uniformes
export const successResponse = (res, data, mensaje = "Operación exitosa") => {
  res.status(200).json({ estado: "success", mensaje, data });
};

export const createdResponse = (res, data, mensaje = "Recurso creado") => {
  res.status(201).json({ estado: "success", mensaje, data });
};
