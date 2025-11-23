// utils/cloudinary.js
import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import { PassThrough } from "stream";

// ======================================
// 📌 Validar variable CLOUDINARY_URL
// ======================================
const cloudinaryURL = process.env.CLOUDINARY_URL;

if (!cloudinaryURL) {
  throw new Error("❌ CLOUDINARY_URL no definido en .env");
}

// Regex totalmente compatible con API_SECRET con caracteres especiales
const match = cloudinaryURL.match(
  /^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/
);

if (!match) {
  throw new Error("❌ CLOUDINARY_URL tiene un formato inválido");
}

const [, api_key, api_secret, cloud_name] = match;

// ======================================
// 📌 Configuración de Cloudinary
// ======================================
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

console.log("✅ Cloudinary configurado correctamente:", {
  cloud_name,
  api_key: api_key.slice(0, 4) + "*****",
});

// ======================================
// 📌 Subir buffer a Cloudinary
// ======================================
export const uploadImageBuffer = (buffer, folder = "hermanos-jota") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const bufferStream = new PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(uploadStream);
  });
};

// ======================================
// 📌 Eliminar imagen en Cloudinary
// ======================================
export const deleteImageCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.warn("⚠️ Error eliminando imagen:", err.message);
  }
};

export default cloudinary;
