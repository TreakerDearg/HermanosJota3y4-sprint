// src/utils/getImagenUrl.js
export function getImagenUrl(producto) {
  // 1️⃣ Si no existe el producto, devolvemos placeholder
  if (!producto) return "/images/placeholder.png";

  // 2️⃣ Imagen desde Cloudinary (nueva)
  if (producto.imagenUrl && producto.imagenUrl.startsWith("http")) {
    return producto.imagenUrl;
  }

  // 3️⃣ Imagen del backend antiguo (por si aún queda alguna)
  if (producto.imagen && typeof producto.imagen === "string") {
    return producto.imagen.startsWith("/")
      ? producto.imagen
      : `/${producto.imagen}`;
  }

  // 4️⃣ Si no encontramos imagen → placeholder
  return "/images/placeholder.png";
}
