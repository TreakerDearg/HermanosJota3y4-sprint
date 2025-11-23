// middlewares/uploadCloudinary.js
import multer from "multer";

// ==========================
// Almacenamiento en memoria
// ==========================
const storage = multer.memoryStorage();

// ==========================
// Validación de archivos
// ==========================
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Solo se permiten imágenes"), false);
  }
  cb(null, true);
};

// ==========================
// Configuración de Multer
// ==========================
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// ==========================
// Middleware de Manejo de Errores
// ==========================
export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      estado: "error",
      mensaje: "Error al subir la imagen",
      detalle: err.message,
    });
  }

  if (err) {
    return res.status(400).json({
      estado: "error",
      mensaje: err.message || "Error al procesar archivo",
    });
  }

  next();
};
