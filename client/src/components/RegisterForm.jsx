import { useState } from "react";
import "../styles/components/RegisterForm.css";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function RegisterForm({ switchToLogin, onRegister }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onRegister) onRegister({ nombre, email, password });
  };

  return (
    <form className="register-terminal-form" onSubmit={handleSubmit}>
      <h2 className="register-terminal-title">Registrarse</h2>

      <label>Nombre</label>
      <input
        type="text"
        placeholder="Tu nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

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

      <button type="submit" className="btn-terminal-register">
        Registrarse
      </button>

      <p className="auth-switch-text-terminal" onClick={switchToLogin}>
        ¿Ya tienes cuenta? <span className="auth-switch-highlight">Inicia Sesión</span>
      </p>
    </form>
  );
}
