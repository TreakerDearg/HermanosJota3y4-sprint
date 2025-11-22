// src/pages/UserProfile.jsx
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  LogOut,
  UserCog,
  PackageSearch,
  ShieldCheck,
  Settings2,
  KeyRound,
  LocateFixed,
  CreditCard,
  BellRing,
  Clock9,
} from "lucide-react";

import "../styles/pages/UserProfile.css";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="up-container">

      {/* HEADER */}
      <header className="up-header">
        <div className="up-header-left">
          <h1 className="up-title">Mi Perfil</h1>
          <p className="up-subtitle">Configuración, seguridad y actividad</p>
        </div>

        <div className="up-role-badge">
          <ShieldCheck size={18} />
          <span>{user.rol.toUpperCase()}</span>
        </div>
      </header>

      {/* INFORMACIÓN PERSONAL */}
      <section className="up-section">
        <h2 className="up-section-title">
          <UserCog size={20} /> Información personal
        </h2>

        <div className="up-card">
          <div className="up-info-grid">
            <div className="up-info-item">
              <span className="label">Nombre:</span>
              <span className="value">{user.nombre}</span>
            </div>

            <div className="up-info-item">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>

            <div className="up-info-item">
              <span className="label">Rol:</span>
              <span className="value">{user.rol}</span>
            </div>

            <div className="up-info-item">
              <span className="label">Miembro desde:</span>
              <span className="value">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            className="up-btn up-btn-edit"
            onClick={() => navigate("/editar-perfil")}
          >
            <Settings2 size={18} /> Editar perfil
          </button>
        </div>
      </section>

      {/* SEGURIDAD */}
      <section className="up-section">
        <h2 className="up-section-title">
          <ShieldCheck size={20} /> Seguridad
        </h2>

        <div className="up-card">
          <div className="up-info-grid">
            <div className="up-info-item">
              <span className="label">Nivel de seguridad:</span>
              <span className="value secure">
                {user.password?.length >= 10
                  ? "Alta seguridad"
                  : "Se recomienda actualizar"}
              </span>
            </div>

            <div className="up-info-item">
              <span className="label">Email verificado:</span>
              <span className="value">
                {user.emailVerified ? "Sí" : "Pendiente"}
              </span>
            </div>

            <div className="up-info-item">
              <span className="label">Último acceso:</span>
              <span className="value">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleString()
                  : "—"}
              </span>
            </div>
          </div>

          <button
            className="up-btn up-btn-secondary"
            onClick={() => navigate("/editar-password")}
          >
            <KeyRound size={18} /> Cambiar contraseña
          </button>
        </div>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <section className="up-section">
        <h2 className="up-section-title">
          <Settings2 size={20} /> Ajustes rápidos
        </h2>

        <div className="up-quick-grid">
          <div className="up-quick-item" onClick={() => navigate("/direcciones")}>
            <LocateFixed size={28} />
            <p>Direcciones</p>
          </div>

          <div className="up-quick-item" onClick={() => navigate("/metodos-pago")}>
            <CreditCard size={28} />
            <p>Métodos de pago</p>
          </div>

          <div className="up-quick-item" onClick={() => navigate("/notificaciones")}>
            <BellRing size={28} />
            <p>Notificaciones</p>
          </div>

          <div className="up-quick-item" onClick={() => navigate("/actividad")}>
            <Clock9 size={28} />
            <p>Actividad</p>
          </div>
        </div>
      </section>

      {/* HISTORIAL DE COMPRAS */}
      <section className="up-section">
        <h2 className="up-section-title">
          <PackageSearch size={20} /> Historial de compras
        </h2>

        <div className="up-card up-empty">
          <PackageSearch size={45} className="up-empty-icon" />
          <p>No registras compras aún.</p>
        </div>
      </section>

      {/* LOGOUT */}
      <footer className="up-footer">
        <button className="up-btn up-btn-logout" onClick={logout}>
          <LogOut size={18} /> Cerrar sesión
        </button>
      </footer>
    </div>
  );
}
