import { useState } from "react";
import { FaCreditCard, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import "../styles/pages/MetodosPago.css";

export default function MetodosPago() {
  const [metodos, setMetodos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", numero: "", vencimiento: "" });

  const handleAgregar = () => {
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setFormData({ nombre: "", numero: "", vencimiento: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.numero || !formData.vencimiento) {
      setMensaje("Todos los campos son obligatorios.");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    const nueva = {
      nombre: formData.nombre,
      ultimo4: formData.numero.slice(-4),
      numero: formData.numero,
      vencimiento: formData.vencimiento,
    };

    setMetodos([...metodos, nueva]);
    setMensaje("¡Simulación! No se ha guardado en un backend real.");
    setTimeout(() => setMensaje(""), 3000);
    handleCerrarModal();
  };

  const handleEliminar = (index) => {
    const copia = [...metodos];
    copia.splice(index, 1);
    setMetodos(copia);
    setMensaje("¡Simulación! El método ha sido eliminado localmente.");
    setTimeout(() => setMensaje(""), 3000);
  };

  return (
    <div className="up-container">
      <div className="up-header">
        <h1 className="up-title">Métodos de Pago</h1>
        <span className="up-subtitle">
          Gestión de tarjetas y pagos (solo simulación)
        </span>
      </div>

      <div className="up-section">
        <h2 className="up-section-title">Tus métodos guardados</h2>

        {metodos.length === 0 ? (
          <div className="up-empty">
            <FaCreditCard className="up-empty-icon" size={50} />
            <p>No tienes tarjetas registradas actualmente.</p>
          </div>
        ) : (
          <div className="up-list">
            {metodos.map((m, idx) => (
              <div className="up-item" key={idx}>
                <FaCreditCard className="up-item-icon" />
                <div className="up-item-info">
                  <span>{`**** **** **** ${m.ultimo4}`}</span>
                  <span>{m.nombre}</span>
                  <span>Venc.: {m.vencimiento}</span>
                </div>
                <div className="up-item-actions">
                  <button
                    className="up-btn-small"
                    onClick={() => handleEliminar(idx)}
                    title="Eliminar tarjeta"
                  >
                    <FaTrash />
                  </button>
                  <button
                    className="up-btn-small"
                    onClick={() => setMensaje("¡Simulación! Editar método aún no implementado.")}
                    title="Editar tarjeta"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="up-btn up-btn-add" onClick={handleAgregar}>
        <FaPlus style={{ marginRight: "0.5rem" }} /> Agregar nuevo método de pago
      </button>

      {/* Modal de agregar tarjeta */}
      {modalOpen && (
        <div className="modal-overlay" onClick={handleCerrarModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Agregar Tarjeta</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <label>
                Nombre en la tarjeta
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Juan Pérez"
                  required
                />
              </label>
              <label>
                Número de tarjeta
                <input
                  type="text"
                  value={formData.numero}
                  onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={16}
                />
              </label>
              <label>
                Vencimiento
                <input
                  type="text"
                  value={formData.vencimiento}
                  onChange={(e) => setFormData({ ...formData, vencimiento: e.target.value })}
                  placeholder="MM/AA"
                  required
                  maxLength={5}
                />
              </label>
              <div className="modal-actions">
                <button type="submit" className="up-btn up-btn-add">
                  Guardar
                </button>
                <button type="button" className="up-btn up-btn-cancel" onClick={handleCerrarModal}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mensaje && <div className="up-toast">{mensaje}</div>}
    </div>
  );
}
