import { createContext, useContext, useState, useCallback } from "react";
import api from "../services/api";
import { registerLogoutHandler } from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // ========================================================================
  // 🔐 USER STATE
  // ========================================================================
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const removeUser = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ========================================================================
  // 🚪 LOGOUT
  // ========================================================================
  const logout = useCallback(() => {
    console.log("🚪 Cerrando sesión (logout ejecutado)");
    removeUser();
    window.location.href = "/login";
  }, []);

  // Registrar logout dentro de Axios
  registerLogoutHandler(logout);

  // ========================================================================
  // 🔐 LOGIN
  // ========================================================================
  const login = useCallback(async (email, password) => {
    if (!email || !password) {
      return { success: false, error: "Email y contraseña son requeridos" };
    }

    setLoading(true);
    try {
      console.log("📡 Enviando login:", { email });

      const { data } = await api.post("/auth/login", { email, password });

      console.log("📥 Respuesta backend login:", data);

      const userData = data.data;
      saveUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      console.error("💥 Error login:", err);
      return {
        success: false,
        error: err.response?.data?.mensaje || "Error de login",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================================================
  // 🆕 REGISTER
  // ========================================================================
  const register = useCallback(async (nombre, email, password) => {
    if (!nombre || !email || !password) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    setLoading(true);
    try {
      console.log("📡 Enviando registro:", { nombre, email });

      const { data } = await api.post("/auth/register", {
        nombre,
        email,
        password,
      });

      console.log("📥 Respuesta backend register:", data);

      const userData = data.data;
      saveUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      console.error("💥 Error register:", err);
      return {
        success: false,
        error: err.response?.data?.mensaje || "Error de registro",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // ========================================================================
  // ✏️ UPDATE USER
  // ========================================================================
  const updateUser = (newData) => {
    const updated = { ...user, ...newData };
    saveUser(updated);
  };

  // ========================================================================
  // 🔒 CHANGE PASSWORD
  // ========================================================================
  const changePassword = async (currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
      return { success: false, error: "Todos los campos son obligatorios" };
    }

    setLoading(true);
    try {
      console.log("📡 Cambio de contraseña");

      const { data } = await api.put("/auth/update-password", {
        currentPassword,
        newPassword,
      });

      console.log("📥 Respuesta backend cambio contraseña:", data);

      return { success: true, mensaje: data.mensaje };
    } catch (err) {
      console.error("💥 Error cambio contraseña:", err);
      return {
        success: false,
        error: err.response?.data?.mensaje || "Error al cambiar contraseña",
      };
    } finally {
      setLoading(false);
    }
  };

  // ========================================================================
  // CONTEXT VALUE
  // ========================================================================
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
