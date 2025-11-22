// src/context/ProductContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://hermanosjota3y4-sprint.onrender.com";

const ProductContext = createContext();
export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const { user } = useAuth();
  const token = user?.token || "";

  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchedOnce = useRef(false);
  const abortController = useRef(null);

  // ============================================================
  // GET ALL
  // ============================================================
  const fetchProductos = useCallback(async () => {
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/productos`, {
        signal: abortController.current.signal,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) throw new Error("Error al cargar productos");

      const data = await res.json();
      const productosConImagen = Array.isArray(data.data)
        ? data.data.map((p) => ({
            ...p,
            imagenUrl: p.imagenUrl || "/images/placeholder.png",
          }))
        : [];

      setProductos(productosConImagen);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Error desconocido al cargar productos");
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!fetchedOnce.current) {
      fetchedOnce.current = true;
      fetchProductos();
    }
    return () => abortController.current?.abort();
  }, [fetchProductos]);

  // ============================================================
  // GET ONE
  // ============================================================
  const getProductoById = useCallback(
    (id) => {
      const prod = productos.find((p) => p._id === id);
      return prod ? { ...prod, imagenUrl: prod.imagenUrl || "/images/placeholder.png" } : null;
    },
    [productos]
  );

  // ============================================================
  // FormData Builder
  // ============================================================
  const buildFormData = useCallback((producto) => {
    const fd = new FormData();
    Object.entries(producto).forEach(([key, value]) => {
      if (key === "imagen") {
        if (value instanceof File) fd.append("imagen", value);
      } else if (value !== undefined && value !== null) {
        fd.append(key, value);
      }
    });
    return fd;
  }, []);

  // ============================================================
  // CREATE
  // ============================================================
  const crearProducto = useCallback(
    async (nuevo) => {
      try {
        const res = await fetch(`${API_BASE}/productos`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: buildFormData(nuevo),
        });

        const data = await res.json();
        await fetchProductos();
        return data;
      } catch (err) {
        return { estado: "error", mensaje: err.message };
      }
    },
    [fetchProductos, buildFormData, token]
  );

  // ============================================================
  // UPDATE
  // ============================================================
  const actualizarProducto = useCallback(
    async (id, updates) => {
      try {
        const res = await fetch(`${API_BASE}/productos/${id}`, {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: buildFormData(updates),
        });

        const data = await res.json();
        await fetchProductos();
        return data;
      } catch (err) {
        return { estado: "error", mensaje: err.message };
      }
    },
    [fetchProductos, buildFormData, token]
  );

  // ============================================================
  // DELETE
  // ============================================================
  const eliminarProducto = useCallback(
    async (id) => {
      try {
        const res = await fetch(`${API_BASE}/productos/${id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();
        await fetchProductos();
        return data;
      } catch (err) {
        return { estado: "error", mensaje: err.message };
      }
    },
    [fetchProductos, token]
  );

  return (
    <ProductContext.Provider
      value={{
        productos,
        loading,
        error,
        token,
        fetchProductos,
        getProductoById,
        crearProducto,
        actualizarProducto,
        eliminarProducto,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
