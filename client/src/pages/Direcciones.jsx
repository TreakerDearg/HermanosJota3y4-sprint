export default function Direcciones() {
  return (
    <div className="up-container">
      <div className="up-header">
        <h1 className="up-title">Direcciones</h1>
        <span className="up-subtitle">Administrá tu información de envío</span>
      </div>

      <div className="up-section">
        <h2 className="up-section-title">Tus direcciones guardadas</h2>

        <div className="up-empty">
          <div className="up-empty-icon">📍</div>
          <p>No tenés direcciones establecidas.</p>
        </div>
      </div>

      <button className="up-btn up-btn-edit">
        + Agregar nueva dirección
      </button>
    </div>
  );
}
