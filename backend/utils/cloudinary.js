import dotenv from "dotenv";
dotenv.config(); // 🔹 Esto debe ir primero

import { v2 as cloudinary } from "cloudinary";
import { PassThrough } from "stream";

// Validar que exista CLOUDINARY_URL
if (!process.env.CLOUDINARY_URL) {
  throw new Error("❌ CLOUDINARY_URL no definido en .env");
}

// Configuración segura
cloudinary.config({ secure: true });

// Subir buffer
export const uploadFromBuffer = (buffer, folder = "hermanos-jota") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    const bufferStream = new PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(stream);
  });
};

// Eliminar imagen
export const deleteImage = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.warn("⚠️ Error eliminando imagen en Cloudinary:", err.message);
  }
};

export default cloudinary;
