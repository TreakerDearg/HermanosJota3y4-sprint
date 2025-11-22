import { sanitizeBody } from "express-validator";

/**
 * Middleware para limpiar/sanitizar los inputs del request
 * Ejemplo de sanitización de strings, trim y escape
 */
export const sanitize = (fields = []) => {
  return fields.map((field) =>
    sanitizeBody(field).trim().escape()
  );
};
