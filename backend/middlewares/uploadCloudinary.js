// middlewares/uploadCloudinary.js
import multer from "multer";

// Guardar archivos en memoria (buffer) para subirlos luego a Cloudinary
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // máximo 5 MB
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir imágenes
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Solo se permiten archivos de imagen"));
    }
    cb(null, true);
  },
});
