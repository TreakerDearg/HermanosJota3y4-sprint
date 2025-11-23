import { useState } from "react";
import { FaUser, FaEnvelope, FaComment, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import "../styles/components/ContactForm.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.email || !formData.mensaje) {
      alert("Por favor completa todos los campos.");
      return;
    }

    console.log("Datos enviados:", formData);
    setEnviado(true);
    setFormData({ nombre: "", email: "", mensaje: "" });

    setTimeout(() => setEnviado(false), 4000);
  };

  return (
    <section className="contact-form">
      <h2 className="form-title">
        <FaEnvelope style={{ marginRight: "0.5rem" }} /> Contáctanos
      </h2>

      <form onSubmit={handleSubmit} className="form-content">
        <div className="input-group">
          <label htmlFor="nombre">
            <FaUser style={{ marginRight: "0.3rem" }} /> Nombre
          </label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">
            <FaEnvelope style={{ marginRight: "0.3rem" }} /> Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="mensaje">
            <FaComment style={{ marginRight: "0.3rem" }} /> Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder="Escribe tu mensaje aquí..."
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          <FaPaperPlane style={{ marginRight: "0.5rem" }} /> Enviar
        </button>
      </form>

      {enviado && (
        <div className="mensaje-exito">
          <FaCheckCircle style={{ marginRight: "0.3rem" }} /> ¡Tu mensaje fue enviado con éxito!
        </div>
      )}
    </section>
  );
}
