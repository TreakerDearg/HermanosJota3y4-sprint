export default function MetodosPago() {
  return (
    <div className="up-container">
      <div className="up-header">
        <h1 className="up-title">Métodos de Pago</h1>
        <span className="up-subtitle">Gestión de tarjetas y pagos</span>
      </div>

      <div className="up-section">
        <h2 className="up-section-title">Tus métodos guardados</h2>

        <div className="up-empty">
          <div className="up-empty-icon">💳</div>
          <p>No hay tarjetas registradas actualmente.</p>
        </div>
      </div>

      <button className="up-btn up-btn-edit">
        + Agregar nuevo método de pago
      </button>
    </div>
  );
}
