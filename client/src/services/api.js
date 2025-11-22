import axios from "axios";

// ============================================================================
// 🔐 Handler global para logout (se registra desde AuthContext)
// ============================================================================
let globalLogout = null;

export const registerLogoutHandler = (fn) => {
  globalLogout = fn;
};

// ============================================================================
// 🌐 AXIOS INSTANCE
// ============================================================================
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

console.log("🌐 API BASE URL:", BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// 📤 REQUEST INTERCEPTOR
// ============================================================================
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
        console.log("🔐 Enviando token en request");
      }
    }

    console.log("➡️ Request:", {
      url: config.url,
      method: config.method,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error("❌ Error en request:", error);
    return Promise.reject(error);
  }
);

// ============================================================================
// 📥 RESPONSE INTERCEPTOR
// ============================================================================
api.interceptors.response.use(
  (response) => {
    console.log("⬅️ Respuesta API:", response.data);
    return response;
  },
  (error) => {
    console.error("💥 Error en respuesta API:", error);

    const status = error.response?.status;

    if (status === 401 || status === 403) {
      console.warn("⚠️ Token inválido o expirado. Cerrando sesión…");

      if (globalLogout) {
        globalLogout(); // 👉 cierra sesión desde el AuthContext REAL
      } else {
        console.warn("⚠️ No hay logout registrado.");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
