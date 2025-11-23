import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import { PassThrough } from "stream";

const cloudinaryURL = process.env.CLOUDINARY_URL;

if (!cloudinaryURL) throw new Error("❌ CLOUDINARY_URL no definido en .env");

const match = cloudinaryURL.match(/^cloudinary:\/\/(\w+):(.+)@([\w-]+)$/);
if (!match) throw new Error("❌ CLOUDINARY_URL tiene un formato inválido");

const [, api_key, api_secret, cloud_name] = match;

cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
console.log("✅ Cloudinary configurado:", { cloud_name, api_key: api_key.slice(0,4)+"*****" });

// Subir desde buffer
export const uploadFromBuffer = (buffer, folder = "hermanos-jota") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
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
    console.warn("⚠️ Error eliminando imagen:", err.message);
  }
};

export default cloudinary;
