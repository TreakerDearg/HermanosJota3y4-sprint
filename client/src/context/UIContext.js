// src/context/UIContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const UIContext = createContext();
export const useUI = () => useContext(UIContext);

export const UIProvider = ({ children }) => {
  // Estados de modales
  const [modalCarrito, setModalCarrito] = useState(false);
  const [modalLogin, setModalLogin] = useState(false); // ejemplo para futuros modales
  const [modalCustom, setModalCustom] = useState(null); // modal genérico con contenido dinámico

  // Modales carrito
  const openModalCarrito = useCallback(() => setModalCarrito(true), []);
  const closeModalCarrito = useCallback(() => setModalCarrito(false), []);
  const toggleModalCarrito = useCallback(() => setModalCarrito((prev) => !prev), []);

  // Modales login
  const openModalLogin = useCallback(() => setModalLogin(true), []);
  const closeModalLogin = useCallback(() => setModalLogin(false), []);
  const toggleModalLogin = useCallback(() => setModalLogin((prev) => !prev), []);

  // Modal genérico
  const openModalCustom = useCallback((content) => setModalCustom(content), []);
  const closeModalCustom = useCallback(() => setModalCustom(null), []);

  return (
    <UIContext.Provider
      value={{
        // Carrito
        modalCarrito,
        openModalCarrito,
        closeModalCarrito,
        toggleModalCarrito,

        // Login
        modalLogin,
        openModalLogin,
        closeModalLogin,
        toggleModalLogin,

        // Modal genérico
        modalCustom,
        openModalCustom,
        closeModalCustom,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
