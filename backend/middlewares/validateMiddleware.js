import { body, validationResult, param, query } from "express-validator";

/**
 * Middleware para validar datos de requests usando express-validator.
 * Recibe un array de reglas y devuelve errores si existen.
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Ejecuta todas las reglas
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Formato uniforme de errores
    return res.status(400).json({
      estado: "error",
      mensaje: "Datos inválidos",
      errores: errors.array().map((e) => ({
        campo: e.param,
        mensaje: e.msg,
      })),
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
    });
  };
};

// Reglas de ejemplo para crear producto
export const productRules = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("precio").isFloat({ gt: 0 }).withMessage("El precio debe ser mayor a 0"),
  body("categoria").notEmpty().withMessage("La categoría es obligatoria"),
  body("stock").isInt({ min: 0 }).withMessage("El stock debe ser >= 0"),
];
