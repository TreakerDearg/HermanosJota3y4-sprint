import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/EditPassword.css";

export default function EditPassword() {
  const navigate = useNavigate();
  const { changePassword, user } = useAuth();

  const [form, setForm] = useState({ actual: "", nueva: "", repetir: "" });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null); // mensaje de éxito/error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMensaje({ type: "error", text: "Debes iniciar sesión para cambiar la contraseña" });
      return;
    }

    if (!form.actual || !form.nueva || !form.repetir) {
      setMensaje({ type: "error", text: "Completa todos los campos" });
      return;
    }

    if (form.nueva !== form.repetir) {
      setMensaje({ type: "error", text: "Las contraseñas no coinciden" });
      return;
    }

    setLoading(true);
    const res = await changePassword(form.actual, form.nueva);
    setLoading(false);

    if (res.success) {
      setMensaje({ type: "success", text: res.mensaje || "Contraseña actualizada correctamente" });
      setForm({ actual: "", nueva: "", repetir: "" });
    } else {
      setMensaje({ type: "error", text: res.error });
    }
  };

  return (
    <div className="editpass-container">
      <button className="back-btn" onClick={() => navigate("/perfil")}>
        <ArrowLeft /> Volver
      </button>

      <div className="editpass-box">
        <h1 className="editpass-title">
          <KeyRound size={32} /> Cambiar contraseña
        </h1>

        <p className="editpass-sub">
          Asegurate de elegir una contraseña fuerte y única.
        </p>

        {mensaje && (
          <div className={`mensaje ${mensaje.type}`}>
            {mensaje.text}
          </div>
        )}

        <form className="editpass-form" onSubmit={handleSubmit}>
          <label>
            Contraseña actual
            <input
              type="password"
              name="actual"
              value={form.actual}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <label>
            Nueva contraseña
            <input
              type="password"
              name="nueva"
              value={form.nueva}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <label>
            Repetir nueva contraseña
            <input
              type="password"
              name="repetir"
              value={form.repetir}
              onChange={handleChange}
              disabled={loading}
            />
          </label>

          <button type="submit" className="save-btn" disabled={loading}>
            <ShieldCheck size={18} /> {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
}
