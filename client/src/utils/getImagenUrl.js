// src/utils/getImagenUrl.js
export function getImagenUrl(producto) {
  // Imagen por defecto si no hay producto o imagen
  if (!producto) return "/images/placeholder.png";

  const API_BASE = (process.env.REACT_APP_API_URL || "http://localhost:5000")
    .replace(/\/api$/, "")
    .replace(/\/$/, "");

  // Intentamos obtener la URL de varias propiedades
  const rawUrl = producto.imagenUrl || producto.imagen || "";

  if (!rawUrl) return "/images/placeholder.png";

  // Normalizamos la ruta
  let normalized = rawUrl.replace(/\\/g, "/").trim();

  // Si ya es URL absoluta
  if (/^https?:\/\//i.test(normalized)) return normalized;

  // Evitamos doble /uploads
  normalized = normalized.replace(/^\/?uploads\/?/, "");

  // Retornamos la URL completa
  return `${API_BASE}/uploads/${normalized}`;
}
