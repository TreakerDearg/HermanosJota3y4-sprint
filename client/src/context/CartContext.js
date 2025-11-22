// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const [carrito, setCarrito] = useState([]);

  // 🔄 Cargar carrito del usuario desde localStorage
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`carrito_${user._id}`);
      setCarrito(saved ? JSON.parse(saved) : []);
    } else {
      setCarrito([]);
    }
  }, [user]);

  // 🔄 Guardar carrito en localStorage por usuario
  const persistCart = (newCart) => {
    if (user) {
      localStorage.setItem(`carrito_${user._id}`, JSON.stringify(newCart));
    }
  };

  const agregarAlCarrito = useCallback(
    (producto) => {
      if (!user) {
        alert("Debes iniciar sesión para agregar productos al carrito");
        return;
      }
      setCarrito((prev) => {
        const existente = prev.find((p) => p._id === producto._id);
        let updated;
        if (existente) {
          updated = prev.map((p) =>
            p._id === producto._id ? { ...p, cantidad: (p.cantidad || 1) + 1 } : p
          );
        } else {
          updated = [...prev, { ...producto, cantidad: 1 }];
        }
        persistCart(updated);
        return updated;
      });
    },
    [user]
  );

  const eliminarProducto = useCallback(
    (id) => {
      if (!user) {
        alert("Debes iniciar sesión para eliminar productos del carrito");
        return;
      }
      setCarrito((prev) => {
        const updated = prev.filter((item) => item._id !== id);
        persistCart(updated);
        return updated;
      });
    },
    [user]
  );

  const actualizarCantidad = useCallback(
    (id, cantidad) => {
      if (!user) {
        alert("Debes iniciar sesión para actualizar el carrito");
        return;
      }
      setCarrito((prev) => {
        const updated = prev.map((p) => (p._id === id ? { ...p, cantidad } : p));
        persistCart(updated);
        return updated;
      });
    },
    [user]
  );

  const vaciarCarrito = useCallback(() => {
    if (!user) {
      alert("Debes iniciar sesión para vaciar el carrito");
      return;
    }
    setCarrito([]);
    if (user) localStorage.removeItem(`carrito_${user._id}`);
  }, [user]);

  const total = useMemo(
    () => carrito.reduce((acc, p) => acc + (p.precio || 0) * (p.cantidad || 1), 0),
    [carrito]
  );

  const cantidadTotal = useMemo(
    () => carrito.reduce((acc, p) => acc + (p.cantidad || 1), 0),
    [carrito]
  );

  const hasItems = carrito.length > 0;

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
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
