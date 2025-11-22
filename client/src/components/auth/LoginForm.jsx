import { useState } from "react";
import PasswordInput from "./PasswordInput";

export default function LoginForm({ switchToRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    console.log("📥 LoginForm submit", { email, password });

    if (!email || !password) {
      setErrorMsg("Completa todos los campos");
      console.warn("⚠️ Campos incompletos");
      return;
    }

    setLoading(true);

    try {
      const result = await onLogin(email, password);
      console.log("✅ Resultado login:", result);

      if (!result.success) {
        setErrorMsg(result.error || "Error desconocido al iniciar sesión");
        console.error("❌ Login fallido:", result.error);
      } else {
        // limpiar inputs si login exitoso
        setEmail("");
        setPassword("");
        console.log("🎉 Login exitoso");
      }
    } catch (err) {
      console.error("💥 Error en handleSubmit login:", err);
      setErrorMsg("Error inesperado al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-box" onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>

      {errorMsg && <div className="auth-error">{errorMsg}</div>}

      <input
        className="auth-input"
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <PasswordInput
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        disabled={loading}
      />

      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

      <p className="auth-switch">
        ¿No tienes cuenta?
        <span onClick={switchToRegister}> Crear una cuenta</span>
      </p>
    </form>
  );
}
