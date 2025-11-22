// src/services/productosService.js

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

// -------------------------------------------------------
// Helper para headers con token (si existe)
// -------------------------------------------------------
function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

// -------------------------------------------------------
// Obtener todos los productos
// -------------------------------------------------------
export async function getProductos() {
  const res = await fetch(`${API_URL}/productos`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) throw new Error("Error obteniendo productos");

  return await res.json();
}

// -------------------------------------------------------
// Obtener un solo producto
// -------------------------------------------------------
export async function getProducto(id) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) throw new Error("Error obteniendo producto");

  return await res.json();
}

// -------------------------------------------------------
// Crear producto (usa multipart/form-data)
// -------------------------------------------------------
export async function crearProducto(formData) {
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(), // No agregar Content-Type, fetch lo hace solo
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Error al crear producto");

  return await res.json();
}

// -------------------------------------------------------
// Actualizar producto (PUT o PATCH)
// -------------------------------------------------------
export async function actualizarProducto(id, formData) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Error al actualizar producto");

  return await res.json();
}

// -------------------------------------------------------
// Eliminar producto
// -------------------------------------------------------
export async function eliminarProducto(id) {
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) throw new Error("Error al eliminar producto");

  return await res.json();
}
