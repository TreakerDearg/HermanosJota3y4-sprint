import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

// ============================================================
// 📦 CONFIGURACIÓN DE RUTA DE SUBIDA
// ============================================================
// En producción (Render), los archivos locales desaparecen tras reinicio.
// Por eso, usamos el directorio temporal del sistema para evitar errores.
const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Si estás en Render, usa una carpeta temporal para evitar errores de permisos.
const UPLOAD_DIR = IS_PRODUCTION
  ? path.join(os.tmpdir(), "uploads") // /tmp/uploads
  : path.join(process.cwd(), "uploads");

// Crea la carpeta si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`[Storage] Carpeta de uploads creada en: ${UPLOAD_DIR}`);
}

// ============================================================
// ⚙️ CONFIGURACIÓN DE ALMACENAMIENTO (STORAGE)
// ============================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const filename = `${Date.now()}_${base}${ext}`;
    console.log(`[Storage] Archivo generado: ${filename}`);
    cb(null, filename);
  },
});

// ============================================================
// 🧩 FILTRO DE ARCHIVOS
// ============================================================
const allowedTypes = /jpeg|jpg|png|webp|gif/;

const fileFilter = (req, file, cb) => {
  const isValidMime = allowedTypes.test(file.mimetype.toLowerCase());
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (isValidMime && isValidExt) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes (jpg, png, webp, gif)."));
  }
};

// ============================================================
// 🚀 INSTANCIA DE MULTER
// ============================================================
export const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 }, // Máx. 3MB
  fileFilter,
});

// ============================================================
// ❗ MANEJO DE ERRORES DE SUBIDA
// ============================================================
export const handleUploadErrors = (err, req, res, next) => {
  if (!err) return next();

  let mensaje = "Error desconocido al subir el archivo.";

  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        mensaje = "El archivo excede el tamaño máximo permitido (3MB).";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        mensaje = "Archivo no esperado en la solicitud.";
        break;
      default:
        mensaje = `Error de Multer: ${err.code}`;
    }
  } else {
    mensaje = err.message;
  }

  console.warn(`[UploadError] ${mensaje}`);
  return res.status(400).json({ estado: "error", mensaje });
};
