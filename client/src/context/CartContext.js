// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [carrito, setCarrito] = useState([]);

  // 🔄 Cargar carrito desde localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`carrito_${user._id}`);
      setCarrito(saved ? JSON.parse(saved) : []);
    } else {
      setCarrito([]);
    }
  }, [user]);

  // 🔄 Guardar carrito en localStorage
  const persistCart = useCallback((newCart) => {
    if (user) {
      localStorage.setItem(`carrito_${user._id}`, JSON.stringify(newCart));
    }
  }, [user]);

  // ================================
  // Agregar producto al carrito
  // ================================
  const agregarAlCarrito = useCallback((producto, cantidad = 1) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      return;
    }
    setCarrito(prev => {
      const existente = prev.find(p => p._id === producto._id);
      let updated;
      if (existente) {
        updated = prev.map(p =>
          p._id === producto._id ? { ...p, cantidad: (p.cantidad || 1) + cantidad } : p
        );
      } else {
        updated = [...prev, { ...producto, cantidad }];
      }
      persistCart(updated);
      return updated;
    });
  }, [user, persistCart]);

  // ================================
  // Eliminar 1 unidad de un producto
  // ================================
  const eliminarUnidad = useCallback((id) => {
    if (!user) {
      alert("Debes iniciar sesión para eliminar productos del carrito");
      return;
    }
    setCarrito(prev => {
      const updated = prev.map(p => {
        if (p._id === id) {
          const nuevaCantidad = (p.cantidad || 1) - 1;
          return { ...p, cantidad: nuevaCantidad };
        }
        return p;
      }).filter(p => p.cantidad > 0); // Eliminar si cantidad <= 0
      persistCart(updated);
      return updated;
    });
  }, [user, persistCart]);

  // ================================
  // Eliminar producto completo
  // ================================
  const eliminarProducto = useCallback((id) => {
    if (!user) {
      alert("Debes iniciar sesión para eliminar productos del carrito");
      return;
    }
    setCarrito(prev => {
      const updated = prev.filter(p => p._id !== id);
      persistCart(updated);
      return updated;
    });
  }, [user, persistCart]);

  // ================================
  // Vaciar todo el carrito
  // ================================
  const vaciarCarrito = useCallback(() => {
    if (!user) {
      alert("Debes iniciar sesión para vaciar el carrito");
      return;
    }
    setCarrito([]);
    localStorage.removeItem(`carrito_${user._id}`);
  }, [user]);

  // ================================
  // Actualizar cantidad
  // ================================
  const actualizarCantidad = useCallback((id, cantidad) => {
    if (!user) {
      alert("Debes iniciar sesión para actualizar el carrito");
      return;
    }
    setCarrito(prev => {
      const updated = prev.map(p => p._id === id ? { ...p, cantidad } : p)
        .filter(p => p.cantidad > 0);
      persistCart(updated);
      return updated;
    });
  }, [user, persistCart]);

  // ================================
  // Totales y cantidad total
  // ================================
  const total = useMemo(() =>
    carrito.reduce((acc, p) => acc + (p.precio || 0) * (p.cantidad || 1), 0)
  , [carrito]);

  const cantidadTotal = useMemo(() =>
    carrito.reduce((acc, p) => acc + (p.cantidad || 1), 0)
  , [carrito]);

  const hasItems = carrito.length > 0;

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarUnidad,
        eliminarProducto,
        actualizarCantidad,
        vaciarCarrito,
        total,
        cantidadTotal,
        hasItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
