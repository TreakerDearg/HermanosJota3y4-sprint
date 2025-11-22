import { useState } from "react";
import "../styles/components/LoginForm.css";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function LoginForm({ switchToRegister, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onLogin) onLogin({ email, password });
  };

  return (
    <form className="login-terminal-form" onSubmit={handleSubmit}>
      <h2 className="login-terminal-title">Iniciar Sesión</h2>

      <label>Email</label>
      <input
        type="email"
        placeholder="correo@ejemplo.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Contraseña</label>
      <div className="password-input-container">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
        </span>
      </div>

      <button type="submit" className="btn-terminal-login">
        Iniciar Sesión
      </button>

      <p className="auth-switch-text-terminal" onClick={switchToRegister}>
        ¿No tienes cuenta? <span className="auth-switch-highlight">Regístrate</span>
      </p>
    </form>
  );
}
