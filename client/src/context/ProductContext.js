import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

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

  // ============================
  // FETCH ALL PRODUCTS
  // ============================
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.mensaje || "Error al cargar productos");
      }

      const data = await res.json();
      setProductos(
        Array.isArray(data.data)
          ? data.data.map((p) => ({ ...p, imagenUrl: p.imagenUrl || "/images/placeholder.png" }))
          : []
      );
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message || "Error desconocido");
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

  // ============================
  // GET PRODUCT BY ID
  // ============================
  const getProductoById = useCallback(
    (id) => {
      const prod = productos.find((p) => p._id === id);
      return prod ? { ...prod, imagenUrl: prod.imagenUrl || "/images/placeholder.png" } : null;
    },
    [productos]
  );

  // ============================
  // HELPER: Build FormData
  // ============================
  const buildFormData = useCallback((producto) => {
    const fd = new FormData();

    Object.entries(producto).forEach(([key, value]) => {
      if (key === "imagen" && value instanceof File) {
        fd.append("imagen", value);
      } else if ((key === "precio" || key === "stock") && value !== "" && value !== null) {
        fd.append(key, Number(value));
      } else if (key === "destacado") {
        fd.append(key, value === true || value === "true");
      } else if (value !== undefined && value !== null) {
        fd.append(key, value.toString());
      }
    });

    return fd;
  }, []);

  // ============================
  // CREATE PRODUCT
  // ============================
  const crearProducto = useCallback(
    async (nuevo) => {
      try {
        const res = await fetch(`${API_BASE}/productos`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: buildFormData(nuevo),
        });

        const data = await res.json();
        if (res.ok && data.estado === "success") await fetchProductos();
        return data;
      } catch (err) {
        return { estado: "error", mensaje: err.message || "Error creando producto" };
      }
    },
    [fetchProductos, buildFormData, token]
  );

  // ============================
  // UPDATE PRODUCT
  // ============================
  const actualizarProducto = useCallback(
    async (id, updates) => {
      try {
        const res = await fetch(`${API_BASE}/productos/${id}`, {
          method: "PUT",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: buildFormData(updates),
        });

        const data = await res.json();
        if (res.ok && data.estado === "success") await fetchProductos();
        return data;
      } catch (err) {
        return { estado: "error", mensaje: err.message || "Error actualizando producto" };
      }
    },
    [fetchProductos, buildFormData, token]
  );

  // ============================
  // DELETE PRODUCT
  // ============================
  const eliminarProducto = useCallback(
    async (id) => {
      try {
        const res = await fetch(`${API_BASE}/productos/${id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data = await res.json();
        if (res.ok && data.estado === "success") await fetchProductos();
        return data;
      } catch (err) {
        return { estado: "error", mensaje: err.message || "Error eliminando producto" };
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
        buildFormData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
