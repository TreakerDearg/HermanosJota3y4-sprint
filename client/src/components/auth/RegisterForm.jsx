import { useState } from "react";
import PasswordInput from "./PasswordInput";

export default function RegisterForm({ switchToLogin, onRegister }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    console.log("📥 RegisterForm submit", { nombre, email, password });

    if (!nombre || !email || !password) {
      setErrorMsg("Completa todos los campos");
      console.warn("⚠️ Campos incompletos en registro");
      return;
    }

    setLoading(true);

    try {
      const result = await onRegister(nombre, email, password);
      console.log("✅ Resultado registro:", result);

      if (!result.success) {
        setErrorMsg(result.error || "Error desconocido al registrarse");
        console.error("❌ Registro fallido:", result.error);
      } else {
        setNombre("");
        setEmail("");
        setPassword("");
        console.log("🎉 Registro exitoso");
      }
    } catch (err) {
      console.error("💥 Error en handleSubmit registro:", err);
      setErrorMsg("Error inesperado al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-box" onSubmit={handleSubmit}>
      <h2>Crear Cuenta</h2>

      {errorMsg && <div className="auth-error">{errorMsg}</div>}

      <input
        className="auth-input"
        type="text"
        placeholder="Nombre completo"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        disabled={loading}
      />

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
        {loading ? "Registrando..." : "Registrarme"}
      </button>

      <p className="auth-switch">
        ¿Ya tienes cuenta?
        <span onClick={switchToLogin}> Iniciar sesión</span>
      </p>
    </form>
  );
}
