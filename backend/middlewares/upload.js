// middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Carpeta de subida configurable desde .env
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

// Crear carpeta si no existe
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ===== Configuración de storage =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-\.]/g, "");
    cb(null, `${timestamp}-${random}-${safeName}${ext}`);
  },
});

// ===== Filtro de archivos =====
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Solo se permiten archivos de imagen"));
  }
  cb(null, true);
};

// ===== Configuración multer =====
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máximo
});

// ===== Middleware para manejo de errores de multer =====
export const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let mensaje = err.message;
    if (err.code === "LIMIT_FILE_SIZE") {
      mensaje = "El archivo es demasiado grande. Máximo 5MB.";
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      mensaje = "Solo se permiten archivos de imagen válidos.";
    }
    return res.status(400).json({ estado: "error", mensaje });
  } else if (err) {
    return res.status(500).json({ estado: "error", mensaje: err.message || "Error desconocido al subir archivo" });
  }
  next();
};
