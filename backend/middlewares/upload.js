// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// En producción, Render/Vercel no permiten escritura persistente fuera de /tmp
const UPLOAD_DIR = IS_PRODUCTION
  ? path.join(os.tmpdir(), "uploads")
  : path.join(process.cwd(), "uploads");

// Crear carpeta si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`[Storage] Carpeta de uploads creada en: ${UPLOAD_DIR}`);
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_")
      .replace(/[^\w_-]/g, ""); // Limpieza adicional
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

// Filtrado de archivos válidos
const allowedTypes = /jpeg|jpg|png|webp|gif/;
const fileFilter = (req, file, cb) => {
  const isMimeValid = allowedTypes.test(file.mimetype.toLowerCase());
  const isExtValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isMimeValid && isExtValid) cb(null, true);
  else cb(new Error("Solo se permiten imágenes (jpg, png, webp, gif)."));
};

// Instancia de Multer
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Subo a 5MB por seguridad
  fileFilter,
});

// Manejo de errores de subida
export const handleUploadErrors = (err, req, res, next) => {
  if (!err) return next();

  let mensaje = "Error al subir el archivo.";

  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        mensaje = "El archivo excede los 5MB permitidos.";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        mensaje = "Archivo inesperado.";
        break;
      default:
        mensaje = `Error interno de Multer: ${err.code}`;
    }
  } else {
    mensaje = err.message;
  }

  console.warn(`[UploadError] ${mensaje}`);
  return res.status(400).json({ estado: "error", mensaje });
};
