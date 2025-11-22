import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loading } = useAuth();
  const navigate = useNavigate(); // 👈 redirección

  // ========================
  // LOGIN
  // ========================
  const handleLogin = async (email, password) => {
    console.log("📥 handleLogin()", { email, password });

    const res = await login(email, password);

    console.log("📤 Resultado login:", res);

    if (!res.success) {
      alert(res.error);
      return res;
    }

    // 🔥 LOGIN OK → REDIRECCIONAR
    navigate("/");

    return res;
  };

  // ========================
  // REGISTER
  // ========================
  const handleRegister = async (nombre, email, password) => {
    console.log("📥 handleRegister()", { nombre, email, password });

    const res = await register(nombre, email, password);

    console.log("📤 Resultado registro:", res);

    if (!res.success) {
      alert(res.error);
      return res;
    }

    // 🔥 Registro OK → también podríamos redirigir
    // navigate("/");
    // pero si querés mantener en la misma vista, lo dejo comentado.

    return res;
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <LoginForm
          switchToRegister={() => setIsLogin(false)}
          onLogin={handleLogin}
          loading={loading}
        />
      ) : (
        <RegisterForm
          switchToLogin={() => setIsLogin(true)}
          onRegister={handleRegister}
          loading={loading}
        />
      )}
    </div>
  );
}
