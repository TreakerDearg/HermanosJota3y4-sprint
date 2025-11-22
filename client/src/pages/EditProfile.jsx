// src/pages/EditProfile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import "../styles/pages/EditProfile.css";
import { Save, User, Mail, ArrowLeft, Phone, Home } from "lucide-react";

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Si no hay usuario logueado, redirigimos
  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  // Datos iniciales
  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [direccion, setDireccion] = useState(user?.direccion || "");

  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await api.put("/auth/update-profile", {
        nombre,
        email,
        telefono,
        direccion,
      });

      console.log("📥 Respuesta update-profile:", res.data);

      // 🔥 Importante: el backend devuelve res.data.data
      updateUser(res.data.data);

      setMsg({
        type: "success",
        text: "Perfil actualizado correctamente.",
      });

      setTimeout(() => navigate("/perfil"), 1000);
    } catch (err) {
      console.error("❌ Error al actualizar perfil:", err);
      setMsg({
        type: "error",
        text: err.response?.data?.mensaje || "Error al actualizar el perfil.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ep-container">
      <button className="ep-back" onClick={() => navigate("/perfil")}>
        <ArrowLeft size={18} /> Volver al perfil
      </button>

      <h1 className="ep-title">Editar Perfil</h1>
      <p className="ep-sub">Modificá tus datos personales</p>

      {msg.text && <div className={`ep-msg ${msg.type}`}>{msg.text}</div>}

      <section className="ep-section">
        <h2 className="ep-section-title">
          <User size={20} /> Información básica
        </h2>

        <div className="ep-field">
          <label>Nombre</label>
          <div className="ep-input">
            <User size={16} />
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre completo"
            />
          </div>
        </div>

        <div className="ep-field">
          <label>Email</label>
          <div className="ep-input">
            <Mail size={16} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuemail@dominio.com"
            />
          </div>
        </div>

        <div className="ep-field">
          <label>Teléfono</label>
          <div className="ep-input">
            <Phone size={16} />
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: +54 9 11 1234-5678"
            />
          </div>
        </div>

        <div className="ep-field">
          <label>Dirección</label>
          <div className="ep-input">
            <Home size={16} />
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Calle, número, ciudad"
            />
          </div>
        </div>

        <button
          className="ep-btn ep-save"
          onClick={handleUpdate}
          disabled={loading}
        >
          <Save size={18} />
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </section>
    </div>
  );
}
